import { deliveryEmail } from "@/lib/email/templates";
import type { NormalizedApprovedPayment } from "@/lib/payments/types";
import type { DeliverResult, DeliveryDeps } from "@/lib/delivery/types";

const CLAIM_STALE_MS = 5 * 60 * 1000;

export { CLAIM_STALE_MS };

/**
 * Único paso de entrega. Mercado Pago (y después Lemon Squeezy) llegan acá
 * con un pago ya normalizado. Graba el pedido una sola vez, arma el enlace
 * y manda el mail. Un aviso repetido no vuelve a enviar el correo.
 */
export async function deliverDigitalOrder(
  payment: NormalizedApprovedPayment,
  deps: DeliveryDeps,
): Promise<DeliverResult> {
  const now = deps.now();
  const expiresAt = new Date(now.getTime() + deps.ttlHours * 60 * 60 * 1000).toISOString();
  const email = payment.email.trim().toLowerCase();
  const { order, created } = await deps.store.insertIfAbsent({
    provider: payment.provider,
    providerPaymentId: payment.providerPaymentId,
    productId: payment.productId,
    productSlug: payment.productId,
    email,
    amount: payment.amount,
    currency: payment.currency.toUpperCase(),
    downloadToken: deps.createToken(),
    downloadExpiresAt: expiresAt,
    metadata: payment.metadata ?? {},
  });

  if (order.emailStatus === "sent") {
    return { outcome: "duplicate", orderId: order.id };
  }

  const claimed = await deps.store.claimEmailSend(order.id, now);
  if (!claimed) {
    const fresh = await deps.store.getById(order.id);
    if (fresh?.emailStatus === "sent") {
      return { outcome: "duplicate", orderId: order.id };
    }
    throw new Error("delivery_in_progress");
  }

  const downloadUrl = `${deps.siteUrl}/descarga/${order.downloadToken}`;
  const message = deliveryEmail({
    productTitle: deps.productTitle,
    downloadUrl,
    expiresAt: order.downloadExpiresAt,
  });

  try {
    await deps.mailer.send({ to: order.email, ...message });
    await deps.store.markEmailSent(order.id, deps.now());
  } catch (error) {
    await deps.store.releaseEmailClaim(order.id);
    throw error;
  }

  return { outcome: created ? "delivered" : "retried", orderId: order.id };
}
