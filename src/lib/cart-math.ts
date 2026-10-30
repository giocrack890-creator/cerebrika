import { getProduct, resolvePriceArs, type Product } from "@/content/products";

/** Cupones reales. Vacío = ningún código es válido y el campo no se muestra. */
export const coupons: readonly { code: string; amountArs: number }[] = [];

export type CartLine = {
  slug: string;
  title: string;
  unitPrice: number;
};

export type CartQuote =
  | {
      ok: true;
      lines: CartLine[];
      subtotal: number;
      discount: number;
      total: number;
      coupon: string | null;
    }
  | { ok: false; error: "empty" | "not_for_sale" | "missing_price" | "invalid_coupon" };

export function uniqueSlugs(slugs: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of slugs) {
    const slug = raw.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push(slug);
  }
  return result;
}

export function findCoupon(code: string | undefined, list: readonly { code: string; amountArs: number }[] = coupons) {
  const trimmed = code?.trim() ?? "";
  if (!trimmed) return { ok: true as const, coupon: null, discount: 0 };
  const match = list.find((item) => item.code.toLowerCase() === trimmed.toLowerCase());
  if (!match || !Number.isSafeInteger(match.amountArs) || match.amountArs <= 0) {
    return { ok: false as const, error: "invalid_coupon" as const };
  }
  return { ok: true as const, coupon: match.code, discount: match.amountArs };
}

export function priceLines(lines: readonly { unitPrice: number }[], discountArs: number) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice, 0);
  const discount = Math.min(subtotal, Math.max(0, discountArs));
  return { subtotal, discount, total: subtotal - discount };
}

/** Reparte un descuento desde el último ítem. Cada precio cobrado queda en al menos $1 si el total alcanza. */
export function chargedUnitPrices(lines: readonly { unitPrice: number }[], total: number): number[] {
  const prices = lines.map((line) => line.unitPrice);
  let delta = prices.reduce((sum, price) => sum + price, 0) - total;
  for (let index = prices.length - 1; index >= 0 && delta > 0; index -= 1) {
    const floor = prices.length > 0 ? 1 : 0;
    const reducible = Math.max(0, prices[index] - floor);
    const cut = Math.min(reducible, delta);
    prices[index] -= cut;
    delta -= cut;
  }
  return prices;
}

export function quoteCart(slugs: readonly string[], couponCode?: string): CartQuote {
  const unique = uniqueSlugs(slugs);
  if (unique.length === 0) return { ok: false, error: "empty" };
  const lines: CartLine[] = [];
  for (const slug of unique) {
    const product: Product | undefined = getProduct(slug);
    if (!product || product.status !== "available") return { ok: false, error: "not_for_sale" };
    const unitPrice = resolvePriceArs(product);
    if (!unitPrice) return { ok: false, error: "missing_price" };
    lines.push({ slug, title: product.title, unitPrice });
  }
  const coupon = findCoupon(couponCode);
  if (!coupon.ok) return { ok: false, error: coupon.error };
  const priced = priceLines(lines, coupon.discount);
  if (priced.total <= 0) return { ok: false, error: "invalid_coupon" };
  return { ok: true, lines, ...priced, coupon: coupon.coupon };
}
