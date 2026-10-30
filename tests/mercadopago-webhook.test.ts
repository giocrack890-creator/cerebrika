import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { deliverDigitalOrder } from "@/lib/delivery/deliver-order";
import type { Mailer, NewOrderInput, OrderRecord, OrderStore } from "@/lib/delivery/types";
import { handleMercadoPagoWebhook } from "@/lib/payments/process-mercadopago-notification";
import type { FetchedPayment } from "@/lib/payments/types";

const SECRET = "test-webhook-secret";
const PRODUCT_ID = "ia-para-docentes";

function sign(dataId: string, requestId: string, ts = "1704908010"): string {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = createHmac("sha256", SECRET).update(manifest).digest("hex");
  return `ts=${ts},v1=${hash}`;
}

function notification(dataId: string, signature: string, requestId = "req-1"): Request {
  const url = new URL("https://ejemplo.test/api/webhooks/mercadopago");
  url.searchParams.set("data.id", dataId);
  url.searchParams.set("type", "payment");
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-signature": signature,
      "x-request-id": requestId,
    },
    body: JSON.stringify({
      action: "payment.updated",
      type: "payment",
      data: { id: dataId },
    }),
  });
}

class MemoryOrderStore implements OrderStore {
  orders: OrderRecord[] = [];

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

  async getByDownloadToken(token: string) {
    return this.orders.find((order) => order.downloadToken === token) ?? null;
  }

  async claimEmailSend(id: string, now: Date) {
    const order = this.orders.find((item) => item.id === id);
    if (!order) return false;
    if (order.emailStatus === "pending") {
      order.emailStatus = "sending";
      order.emailClaimedAt = now.toISOString();
      return true;
    }
    return false;
  }

  async markEmailSent(id: string, now: Date) {
    const order = this.orders.find((item) => item.id === id);
    if (!order) return;
    order.emailStatus = "sent";
    order.emailSentAt = now.toISOString();
  }

  async releaseEmailClaim(id: string) {
    const order = this.orders.find((item) => item.id === id);
    if (!order || order.emailStatus !== "sending") return;
    order.emailStatus = "pending";
    order.emailClaimedAt = null;
  }
}

function payment(status: string, id = "999"): FetchedPayment {
  return {
    id,
    status,
    amount: 12000,
    currency: "ARS",
    email: "docente@escuela.edu.ar",
    externalReference: `${PRODUCT_ID}:abc`,
    productId: PRODUCT_ID,
  };
}

function harness(status: string) {
  const store = new MemoryOrderStore();
  const send = vi.fn(async () => undefined);
  const mailer: Mailer = { send };
  const getPayment = vi.fn(async (id: string) => payment(status, id));
  const deps = {
    webhookSecret: SECRET,
    productId: PRODUCT_ID,
    getPayment,
    deliver: (approved: Parameters<typeof deliverDigitalOrder>[0]) =>
      deliverDigitalOrder(approved, {
        store,
        mailer,
        siteUrl: "https://ejemplo.test",
        productTitle: "IA para docentes",
        ttlHours: 72,
        now: () => new Date("2026-10-30T12:00:00.000Z"),
        createToken: () => "token-seguro-de-prueba-32bytes",
      }),
  };
  return { store, send, getPayment, deps };
}

describe("webhook de Mercado Pago", () => {
  it("entrega el ebook una vez cuando el pago está aprobado", async () => {
    const { store, send, deps } = harness("approved");
    const response = await handleMercadoPagoWebhook(notification("999", sign("999", "req-1")), deps);

    expect(response.status).toBe(200);
    expect(response.body.action).toBe("delivered");
    expect(send).toHaveBeenCalledOnce();
    expect(store.orders).toHaveLength(1);
    expect(store.orders[0]?.emailStatus).toBe("sent");
    expect(store.orders[0]?.email).toBe("docente@escuela.edu.ar");
  });

  it("no vuelve a grabar ni a mandar el mail si el aviso se repite", async () => {
    const { store, send, deps } = harness("approved");
    const requestFactory = () => notification("999", sign("999", "req-1"));

    const first = await handleMercadoPagoWebhook(requestFactory(), deps);
    const second = await handleMercadoPagoWebhook(requestFactory(), deps);

    expect(first.body.action).toBe("delivered");
    expect(second.status).toBe(200);
    expect(second.body.action).toBe("duplicate");
    expect(send).toHaveBeenCalledOnce();
    expect(store.orders).toHaveLength(1);
  });

  it("no entrega nada si el pago fue rechazado", async () => {
    const { store, send, getPayment, deps } = harness("rejected");
    const response = await handleMercadoPagoWebhook(notification("999", sign("999", "req-1")), deps);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ action: "ignored", status: "rejected" });
    expect(getPayment).toHaveBeenCalledOnce();
    expect(send).not.toHaveBeenCalled();
    expect(store.orders).toHaveLength(0);
  });

  it("rechaza una firma inválida sin consultar el pago", async () => {
    const { getPayment, deps } = harness("approved");
    const response = await handleMercadoPagoWebhook(
      notification("999", "ts=1704908010,v1=firma-falsa"),
      deps,
    );

    expect(response.status).toBe(401);
    expect(getPayment).not.toHaveBeenCalled();
  });
});
