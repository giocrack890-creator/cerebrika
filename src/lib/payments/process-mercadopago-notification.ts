import { WebhookSignatureValidator } from "mercadopago";
import { quoteCart } from "@/lib/cart-math";
import type { DeliverResult } from "@/lib/delivery/types";
import { paymentMatchesProduct } from "@/lib/payments/mercadopago";
import type { FetchedPayment, NormalizedApprovedPayment } from "@/lib/payments/types";

export type NotificationResult = {
  status: number;
  body: Record<string, unknown>;
};

export type MercadoPagoHandlerDeps = {
  webhookSecret: string;
  acceptProduct: (payment: FetchedPayment) => { productId: string; productTitle: string } | null;
  getPayment: (id: string) => Promise<FetchedPayment>;
  deliver: (payment: NormalizedApprovedPayment) => Promise<DeliverResult>;
};

function readBodyType(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.type === "string") return record.type;
  if (typeof record.topic === "string") return record.topic;
  return null;
}

/**
 * data.id alfanumérico se pasa en minúsculas, como pide la doc de Mercado Pago.
 * Los ids numéricos no cambian. La comparación HMAC la hace el SDK oficial.
 *
 * No usamos ventana de tiempo: Mercado Pago reintenta el aviso cada 15 minutos
 * y una tolerancia corta rechazaría entregas legítimas. El reintento es inocuo
 * porque la entrega es idempotente y el estado se confirma contra la API.
 */
export function signatureDataId(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return /[a-z]/i.test(trimmed) ? trimmed.toLowerCase() : trimmed;
}

export async function handleMercadoPagoWebhook(
  request: Request,
  deps: MercadoPagoHandlerDeps,
): Promise<NotificationResult> {
  const url = new URL(request.url);
  const dataId = signatureDataId(url.searchParams.get("data.id"));
  const requestId = request.headers.get("x-request-id");
  const signature = request.headers.get("x-signature");
  const queryType = url.searchParams.get("type") ?? url.searchParams.get("topic");

  let body: unknown = null;
  const raw = await request.text();
  if (raw) {
    try {
      body = JSON.parse(raw) as unknown;
    } catch {
      body = null;
    }
  }

  if (!deps.webhookSecret) {
    console.error("webhook_mercadopago_missing_secret");
    return { status: 401, body: { ok: false, error: "invalid_signature" } };
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature: signature,
      xRequestId: requestId,
      dataId,
      secret: deps.webhookSecret,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "invalid_signature";
    console.error("webhook_mercadopago_rejected", reason);
    return { status: 401, body: { ok: false, error: "invalid_signature" } };
  }

  if (!dataId) {
    return { status: 400, body: { ok: false, error: "missing_data_id" } };
  }

  const type = (queryType ?? readBodyType(body) ?? "").toLowerCase();
  if (type !== "payment") {
    return { status: 200, body: { ok: true, action: "ignored", reason: "not_payment" } };
  }

  const payment = await deps.getPayment(dataId);
  if (payment.status !== "approved") {
    return {
      status: 200,
      body: { ok: true, action: "ignored", status: payment.status || "unknown" },
    };
  }

  const delivered = await deliverApprovedPayment(payment, dataId, deps);
  if (!delivered.ok) {
    return { status: 200, body: { ok: true, action: "ignored", reason: delivered.reason } };
  }
  const result = delivered.result;
  return { status: 200, body: { ok: true, action: result.outcome, orderId: result.orderId } };
}

export type DeliverApprovedResult =
  | { ok: true; result: DeliverResult }
  | { ok: false; reason: "not_approved" | "cart_mismatch" | "unrelated_product" };

/**
 * Entrega un pago que ya se consultó a Mercado Pago. La usan el webhook y la página
 * de éxito: la primera que llega graba el pedido y manda el mail; la otra encuentra
 * el pedido ya hecho (es único por proveedor + id de pago) y no duplica nada.
 */
export async function deliverApprovedPayment(
  payment: FetchedPayment,
  fallbackId: string,
  deps: Pick<MercadoPagoHandlerDeps, "acceptProduct" | "deliver">,
): Promise<DeliverApprovedResult> {
  if (payment.status !== "approved") return { ok: false, reason: "not_approved" };
  if (!payment.email) {
    throw new Error("approved_payment_missing_email");
  }

  const cartSlugs = payment.externalReference?.startsWith("cart:")
    ? (payment.productSlugs ?? "").split(",").map((slug) => slug.trim()).filter(Boolean)
    : [];
  if (cartSlugs.length > 0) {
    const quote = quoteCart(cartSlugs, payment.coupon || undefined);
    if (!quote.ok || Math.abs(payment.amount - quote.total) > 1) {
      console.error("webhook_mercadopago_cart_mismatch", payment.id);
      return { ok: false, reason: "cart_mismatch" };
    }
    const result = await deps.deliver({
      provider: "mercadopago",
      providerPaymentId: payment.id || fallbackId,
      email: payment.email,
      amount: payment.amount,
      currency: payment.currency,
      productId: quote.lines[0].slug,
      items: quote.lines,
      metadata: { source: "mercadopago", product_slugs: cartSlugs.join(",") },
    });
    return { ok: true, result };
  }

  const accepted = deps.acceptProduct(payment);
  if (!accepted || !paymentMatchesProduct(payment, accepted.productId)) {
    console.error("webhook_mercadopago_unrelated", payment.id);
    return { ok: false, reason: "unrelated_product" };
  }

  const result = await deps.deliver({
    provider: "mercadopago",
    providerPaymentId: payment.id || fallbackId,
    email: payment.email,
    amount: payment.amount,
    currency: payment.currency,
    productId: accepted.productId,
    items: [{ slug: accepted.productId, title: accepted.productTitle, unitPrice: payment.amount }],
    metadata: { source: "mercadopago" },
  });

  return { ok: true, result };
}
