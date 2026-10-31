import { afterEach, describe, expect, it, vi } from "vitest";
import { createMailer } from "@/lib/email/mailer";
import { deliverApprovedPayment } from "@/lib/payments/process-mercadopago-notification";
import type { FetchedPayment } from "@/lib/payments/types";

function payment(overrides: Partial<FetchedPayment> = {}): FetchedPayment {
  return {
    id: "999",
    status: "approved",
    amount: 12000,
    currency: "ARS",
    email: "docente@example.com",
    externalReference: "cart:abc",
    productId: "ia-para-docentes",
    productSlugs: "ia-para-docentes",
    coupon: null,
    ...overrides,
  };
}

describe("entrega desde la página de éxito", () => {
  it("no entrega un pago que no está aprobado", async () => {
    const deliver = vi.fn();
    const result = await deliverApprovedPayment(payment({ status: "pending" }), "999", { acceptProduct: () => null, deliver });
    expect(result).toEqual({ ok: false, reason: "not_approved" });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("entrega un carrito aprobado cuyo monto coincide", async () => {
    const deliver = vi.fn(async () => ({ outcome: "delivered" as const, orderId: "1" }));
    process.env.PRICE_ARS = "12000";
    const result = await deliverApprovedPayment(payment(), "999", { acceptProduct: () => null, deliver });
    expect(result.ok).toBe(true);
    expect(deliver).toHaveBeenCalledWith(expect.objectContaining({ providerPaymentId: "999", email: "docente@example.com" }));
  });
});

describe("mailer", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("sin Gmail ni Resend avisa qué variable falta", () => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.RESEND_API_KEY;
    expect(() => createMailer()).toThrow(/^Falta la variable de entorno GMAIL_USER/);
  });

  it("con Gmail configurado arma el mailer sin pedir Resend", () => {
    process.env.GMAIL_USER = "cerebrika@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
    delete process.env.RESEND_API_KEY;
    expect(typeof createMailer().send).toBe("function");
  });
});
