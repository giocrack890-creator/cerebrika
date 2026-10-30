import { WebhookSignatureValidator } from "mercadopago";
import type { DeliverResult } from "@/lib/delivery/types";
import { paymentMatchesProduct } from "@/lib/payments/mercadopago";
import type { FetchedPayment, NormalizedApprovedPayment } from "@/lib/payments/types";

export type NotificationResult = {
  status: number;
  body: Record<string, unknown>;
};

export type MercadoPagoHandlerDeps = {
  webhookSecret: string;
  productId: string;
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

  if (!paymentMatchesProduct(payment, deps.productId)) {
    console.error("webhook_mercadopago_unrelated", payment.id);
    return { status: 200, body: { ok: true, action: "ignored", reason: "unrelated_product" } };
  }

  if (!payment.email) {
    throw new Error("approved_payment_missing_email");
  }

  const result = await deps.deliver({
    provider: "mercadopago",
    providerPaymentId: payment.id || dataId,
    email: payment.email,
    amount: payment.amount,
    currency: payment.currency,
    productId: deps.productId,
    metadata: { source: "mercadopago" },
  });

  return { status: 200, body: { ok: true, action: result.outcome, orderId: result.orderId } };
}
