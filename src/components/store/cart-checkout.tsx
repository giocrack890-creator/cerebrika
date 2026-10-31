"use client";

import { useState } from "react";
import Link from "next/link";
import { BookCover } from "@/components/store/book-cover";
import { useCart } from "@/components/store/cart-provider";
import { productParams, trackPixel } from "@/lib/analytics/meta-pixel";
import { coupons, quoteCart } from "@/lib/cart-math";
import { getProduct, isPlaceholderDownload } from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

export function CartCheckout() {
  const { slugs, remove } = useCart();
  const quote = quoteCart(slugs);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placeholder = quote.ok && quote.lines.some((line) => isPlaceholderDownload(line.slug));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quote.ok) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
          coupon: String(form.get("coupon") ?? ""),
          slugs: quote.lines.map((line) => line.slug),
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; initPoint?: string } | null;
      if (!response.ok || !data?.initPoint) {
        setError(data?.error ?? site.checkout.genericError);
        setPending(false);
        return;
      }
      trackPixel(
        "InitiateCheckout",
        productParams(quote.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.unitPrice }))),
      );
      window.location.assign(data.initPoint);
    } catch {
      setError(site.checkout.genericError);
      setPending(false);
    }
  }

  if (!quote.ok) {
    return (
      <div className="rounded-[24px] bg-surface px-5 py-10 text-center shadow-[inset_0_0_0_1px_var(--line)] sm:px-10">
        <p className="font-display text-[22px] font-bold tracking-[-0.02em]">Tu carrito está vacío</p>
        <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">Elegí un ebook del catálogo. Cada uno se agrega una sola vez.</p>
        <Link href="/catalogo" className="btn btn-ink mt-6">
          Ver el catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
      <ul className="divide-y divide-line rounded-[24px] bg-surface px-5 shadow-[inset_0_0_0_1px_var(--line)]">
        {quote.lines.map((line) => {
          const product = getProduct(line.slug);
          return (
            <li key={line.slug} className="flex gap-4 py-5">
              {product ? (
                <Link href={`/productos/${line.slug}`} className="w-16 shrink-0">
                  <BookCover product={product} compact />
                </Link>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-[16px] leading-snug font-medium">{line.title}</p>
                <p className="mt-1 text-[14px] text-muted">PDF · entrega por mail</p>
                <button
                  type="button"
                  className="mt-2 text-[13px] font-medium text-subtle underline-offset-4 hover:text-ink hover:underline"
                  onClick={() => remove(line.slug)}
                >
                  Quitar
                </button>
              </div>
              <p className="shrink-0 text-[16px] font-semibold">{formatArs(line.unitPrice)}</p>
            </li>
          );
        })}
      </ul>
      <form onSubmit={onSubmit} className="relative h-fit rounded-[24px] bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[14px] text-muted">Total</p>
          <p className="font-display text-[28px] font-bold tracking-[-0.03em]">{formatArs(quote.total)}</p>
        </div>
        {quote.discount > 0 ? <p className="mt-1 text-right text-[13px] text-muted">Cupón − {formatArs(quote.discount)}</p> : null}
        <label className="mt-6 block text-[14px] font-medium" htmlFor="cart-email">
          {site.checkout.emailLabel}
        </label>
        <input
          id="cart-email"
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          placeholder={site.checkout.emailPlaceholder}
          className="field mt-2"
        />
        <p className="mt-2 text-[13px] text-subtle">{site.checkout.emailHint}</p>
        {coupons.length > 0 ? (
          <>
            <label className="mt-4 block text-[14px] font-medium" htmlFor="cart-coupon">
              Cupón
            </label>
            <input id="cart-coupon" name="coupon" className="field mt-2" />
          </>
        ) : null}
        <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
          <input name="company" tabIndex={-1} autoComplete="off" />
        </div>
        {error ? (
          <p role="alert" className="mt-4 text-[14px] text-danger">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full">
          {pending ? site.checkout.submitting : site.checkout.submit}
        </button>
        <p className="mt-3 text-[13px] leading-relaxed text-subtle">Pago único. El PDF llega a tu mail cuando el pago se aprueba.</p>
        {placeholder ? <p className="mt-2 text-[13px] leading-relaxed text-subtle">{site.placeholderNotice}</p> : null}
      </form>
    </div>
  );
}
