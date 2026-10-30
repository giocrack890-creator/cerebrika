import type { NormalizedApprovedPayment } from "@/lib/payments/types";

/**
 * Punto de extensión para cobrar en USD con Lemon Squeezy, sobre el mismo
 * pipeline de entrega. No hay ruta ni credenciales todavía.
 *
 * Cuando se agregue:
 * 1. Verificar la firma del webhook (header X-Signature, HMAC del cuerpo crudo).
 * 2. Traducir el evento de orden pagada a NormalizedApprovedPayment
 *    con provider: "lemonsqueezy".
 * 3. Llamar a deliverDigitalOrder(). No reimplementar el mail ni el enlace.
 */
export function normalizeLemonSqueezyOrder(payload: unknown): NormalizedApprovedPayment {
  void payload;
  throw new Error("Lemon Squeezy todavía no está configurado.");
}
