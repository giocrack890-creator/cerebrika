import { getProduct } from "@/content/products";
import type { FetchedPayment } from "@/lib/payments/types";

export type PurchaseEvent = {
  eventId: string;
  items: { slug: string; title: string; price: number }[];
};

/**
 * Arma el Purchase del píxel con un pago ya consultado a Mercado Pago.
 * Solo devuelve algo si el pago está aprobado: nunca contamos una compra
 * por el query string que vuelve del checkout, que cualquiera puede escribir.
 * La suma de los ítems es igual al monto cobrado (cupón incluido).
 */
export function purchaseEventFromPayment(payment: FetchedPayment): PurchaseEvent | null {
  if (payment.status !== "approved" || !payment.id || payment.amount <= 0) return null;
  const slugs = (payment.productSlugs ?? payment.productId ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  const products = slugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
  if (products.length === 0) return null;

  const share = Math.floor((payment.amount / products.length) * 100) / 100;
  const items = products.map((product, index) => ({
    slug: product.slug,
    title: product.title,
    price: index === products.length - 1 ? Math.round((payment.amount - share * (products.length - 1)) * 100) / 100 : share,
  }));
  return { eventId: `mp-${payment.id}`, items };
}
