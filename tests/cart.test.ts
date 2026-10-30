import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { deliverDigitalOrder } from "@/lib/delivery/deliver-order";
import type { Mailer, NewOrderInput, OrderRecord, OrderStore } from "@/lib/delivery/types";
import { priceLines, quoteCart, uniqueSlugs } from "@/lib/cart-math";
import { handleMercadoPagoWebhook } from "@/lib/payments/process-mercadopago-notification";
import type { FetchedPayment, NormalizedApprovedPayment } from "@/lib/payments/types";

describe("carrito", () => {
  it("no duplica un ebook y suma el precio una sola vez", () => {
    const previous = process.env.PRICE_ARS;
    delete process.env.PRICE_ARS;
    try {
      expect(uniqueSlugs(["ia-para-docentes", "ia-para-docentes", "  ia-para-docentes "])).toEqual(["ia-para-docentes"]);
      const quote = quoteCart(["ia-para-docentes", "ia-para-docentes"]);
      expect(quote.ok).toBe(true);
      if (!quote.ok) return;
      expect(quote.lines).toHaveLength(1);
      expect(quote.subtotal).toBe(12000);
      expect(quote.discount).toBe(0);
      expect(quote.total).toBe(12000);
      expect(quoteCart(["ia-para-docentes"], "DESCUENTO-FALSO").ok).toBe(false);
      expect(quoteCart(["ia-para-estudiar"]).ok).toBe(false);
      expect(priceLines([{ unitPrice: 12000 }, { unitPrice: 8000 }], 0)).toEqual({
        subtotal: 20000,
        discount: 0,
        total: 20000,
      });
    } finally {
      if (previous === undefined) delete process.env.PRICE_ARS;
      else process.env.PRICE_ARS = previous;
    }
  });
});

const SECRET = "test-webhook-secret";

function sign(dataId: string, requestId: string, ts = "1704908010"): string {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = createHmac("sha256", SECRET).update(manifest).digest("hex");
  return `ts=${ts},v1=${hash}`;
}

class MemoryOrderStore implements OrderStore {
  orders: OrderRecord[] = [];
  items: { orderId: string; slug: string; token: string }[] = [];

  async insertIfAbsent(input: NewOrderInput) {
    const existing = this.orders.find(
      (order) => order.provider === input.provider && order.providerPaymentId === input.providerPaymentId,
    );
    if (existing) return { order: existing, created: false };
    const order: OrderRecord = {
      id: String(this.orders.length + 1),
      provider: input.provider,
      providerPaymentId: input.providerPaymentId,
      productId: input.productId,
      productSlug: input.productSlug,
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      downloadToken: input.downloadToken,
      downloadExpiresAt: input.downloadExpiresAt,
      emailStatus: "pending",
      emailClaimedAt: null,
      emailSentAt: null,
    };
    this.orders.push(order);
    return { order, created: true };
  }

  async getById(id: string) {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async getByDownloadToken() {
    return null;
  }

  async claimEmailSend(id: string, now: Date) {
    const order = this.orders.find((item) => item.id === id);
    if (!order || order.emailStatus !== "pending") return false;
    order.emailStatus = "sending";
    order.emailClaimedAt = now.toISOString();
    return true;
  }

  async markEmailSent(id: string, now: Date) {
    const order = this.orders.find((item) => item.id === id);
    if (!order) return;
    order.emailStatus = "sent";
    order.emailSentAt = now.toISOString();
  }

  async releaseEmailClaim() {
    return undefined;
  }

  async saveItems(orderId: string, items: { slug: string; downloadToken: string }[]) {
    this.items.push(...items.map((item) => ({ orderId, slug: item.slug, token: item.downloadToken })));
  }
}

describe("entrega de varios ebooks", () => {
  it("manda un enlace por título cuando el webhook es de un carrito", async () => {
    const previous = process.env.PRICE_ARS;
    delete process.env.PRICE_ARS;
    try {
      const quote = quoteCart(["ia-para-docentes"]);
      if (!quote.ok) throw new Error("quote");
      const store = new MemoryOrderStore();
      const send = vi.fn(async (_message: { to: string; subject: string; html: string; text: string }) => undefined);
      const mailer: Mailer = { send };
      let n = 0;
      const payment: FetchedPayment = {
        id: "cart-1",
        status: "approved",
        amount: quote.total + 8000,
        currency: "ARS",
        email: "docente@escuela.edu.ar",
        externalReference: "cart:pedido-1",
        productId: "ia-para-docentes",
        productSlugs: "ia-para-docentes",
      };
      const ignored = await handleMercadoPagoWebhook(
        new Request("https://ejemplo.test/api/webhooks/mercadopago?data.id=cart-1&type=payment", {
          method: "POST",
          headers: {
            "x-signature": sign("cart-1", "req-cart"),
            "x-request-id": "req-cart",
          },
          body: JSON.stringify({ type: "payment", data: { id: "cart-1" } }),
        }),
        {
          webhookSecret: SECRET,
          acceptProduct: () => null,
          getPayment: async () => payment,
          deliver: async (approved: NormalizedApprovedPayment) =>
            deliverDigitalOrder(
              {
                ...approved,
                items: [
                  ...(approved.items ?? []),
                  { slug: "ia-para-el-mail", title: "IA para el mail que venís postergando", unitPrice: 8000 },
                ],
              },
              {
                store,
                mailer,
                siteUrl: "https://ejemplo.test",
                productTitle: "IA para docentes",
                ttlHours: 72,
                now: () => new Date("2026-10-30T12:00:00.000Z"),
                createToken: () => `token-extra-de-prueba-${n++}`,
              },
            ),
        },
      );

      expect(ignored.body.action).toBe("ignored");

      payment.amount = quote.total;
      const delivered = await handleMercadoPagoWebhook(
        new Request("https://ejemplo.test/api/webhooks/mercadopago?data.id=cart-2&type=payment", {
          method: "POST",
          headers: {
            "x-signature": sign("cart-2", "req-cart-2"),
            "x-request-id": "req-cart-2",
          },
          body: JSON.stringify({ type: "payment", data: { id: "cart-2" } }),
        }),
        {
          webhookSecret: SECRET,
          acceptProduct: () => null,
          getPayment: async () => ({ ...payment, id: "cart-2" }),
          deliver: async (approved: NormalizedApprovedPayment) =>
            deliverDigitalOrder(
              {
                ...approved,
                items: [
                  { slug: "ia-para-docentes", title: "IA para docentes", unitPrice: quote.total },
                  { slug: "ia-para-el-mail", title: "IA para el mail que venís postergando", unitPrice: 8000 },
                ],
              },
              {
                store,
                mailer,
                siteUrl: "https://ejemplo.test",
                productTitle: "IA para docentes",
                ttlHours: 72,
                now: () => new Date("2026-10-30T12:00:00.000Z"),
                createToken: () => `token-extra-de-prueba-${n++}`,
              },
            ),
        },
      );

      expect(delivered.body.action).toBe("delivered");
      const html = send.mock.calls[0]?.[0].html ?? "";
      expect(html).toContain("IA para docentes");
      expect(html).toContain("IA para el mail que venís postergando");
      expect(html.match(/DESCARGAR PDF/g)?.length).toBe(2);
      expect(store.items.map((item) => item.slug)).toEqual(["ia-para-docentes", "ia-para-el-mail"]);
    } finally {
      if (previous === undefined) delete process.env.PRICE_ARS;
      else process.env.PRICE_ARS = previous;
    }
  });
});
