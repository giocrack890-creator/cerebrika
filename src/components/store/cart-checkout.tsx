"use client";

import { useState } from "react";
import Link from "next/link";
import { BookCover } from "@/components/store/book-cover";
import { useCart } from "@/components/store/cart-provider";
import { coupons, quoteCart } from "@/lib/cart-math";
import { getProduct } from "@/content/products";
import { formatArs } from "@/lib/format";

export function CartCheckout() {
  const { slugs, remove } = useCart();
  const quote = quoteCart(slugs);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(data?.error ?? "No pudimos abrir el pago.");
        setPending(false);
        return;
      }
      window.location.assign(data.initPoint);
    } catch {
      setError("No pudimos abrir el pago.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        {!quote.ok ? (
          <p className="text-lg text-black/70">
            La bolsa está vacía. <Link href="/catalogo" className="font-semibold text-black">Ver el catálogo</Link>
          </p>
        ) : (
          <ul className="space-y-4">
            {quote.lines.map((line) => {
              const product = getProduct(line.slug);
              return (
                <li key={line.slug} className="flex gap-4 rounded-[24px] bg-white p-4">
                  {product ? (
                    <div className="w-16 shrink-0">
                      <BookCover product={product} compact />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold tracking-[-0.02em]">{line.title}</p>
                    <p className="text-sm">{formatArs(line.unitPrice)}</p>
                    <button type="button" className="mt-2 text-[11px] font-semibold tracking-[0.12em]" onClick={() => remove(line.slug)}>
                      QUITAR
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form onSubmit={onSubmit} className="h-fit rounded-[28px] bg-white p-6">
        <p className="text-sm text-black/60">Subtotal</p>
        <p className="text-4xl font-bold tracking-[-0.045em]">{quote.ok ? formatArs(quote.subtotal) : formatArs(0)}</p>
        {quote.ok && quote.discount > 0 ? <p className="mt-2 text-sm">Cupón − {formatArs(quote.discount)}</p> : null}
        <label className="mt-6 block text-sm font-medium" htmlFor="cart-email">
          Email
        </label>
        <input id="cart-email" name="email" type="email" required autoComplete="email" placeholder="tu@escuela.edu.ar" className="mt-2 w-full rounded-full bg-[#F5F2EB] px-5 py-3 outline-none" />
        {coupons.length > 0 ? (
          <>
            <label className="mt-4 block text-sm font-medium" htmlFor="cart-coupon">
              Cupón
            </label>
            <input id="cart-coupon" name="coupon" className="mt-2 w-full rounded-full bg-[#F5F2EB] px-5 py-3 outline-none" />
          </>
        ) : null}
        <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
          <input name="company" tabIndex={-1} autoComplete="off" />
        </div>
        {error ? <p role="alert" className="mt-4 text-sm text-[#DC2626]">{error}</p> : null}
        <button type="submit" disabled={pending || !quote.ok} className="mt-6 w-full rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white disabled:opacity-60">
          {pending ? "Abriendo Mercado Pago…" : "PAGAR CON MERCADO PAGO"}
        </button>
        <p className="mt-3 text-sm text-black/60">Cada ebook entra una sola vez. El PDF llega al mail cuando el pago se aprueba.</p>
      </form>
    </div>
  );
}
