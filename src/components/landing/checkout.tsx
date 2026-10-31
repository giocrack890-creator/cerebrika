"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { productParams, trackPixel } from "@/lib/analytics/meta-pixel";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

type CheckoutContextValue = {
  openCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout(): CheckoutContextValue {
  const value = useContext(CheckoutContext);
  if (!value) {
    throw new Error("Falta CheckoutProvider.");
  }
  return value;
}

/**
 * Compra directa de un ebook: una hoja con el email y salto a Mercado Pago.
 * Es el camino corto para el tráfico de anuncios; el carrito queda para quien suma varios.
 */
export function CheckoutProvider({
  children,
  price,
  productSlug,
  productTitle,
  placeholderNotice,
}: {
  children: React.ReactNode;
  price: number | null;
  productSlug: string;
  productTitle: string;
  placeholderNotice?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const priceLabel = price ? formatArs(price) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function openCheckout() {
    setError(null);
    setOpen(true);
    if (price) trackPixel("AddToCart", productParams([{ slug: productSlug, title: productTitle, price }]));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!priceLabel || !price) {
      setError(site.checkout.missingPrice);
      return;
    }
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
          slug: productSlug,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; initPoint?: string } | null;
      if (!response.ok || !data?.initPoint) {
        setError(data?.error ?? site.checkout.genericError);
        setPending(false);
        return;
      }
      trackPixel("InitiateCheckout", productParams([{ slug: productSlug, title: productTitle, price }]));
      window.location.assign(data.initPoint);
    } catch {
      setError(site.checkout.genericError);
      setPending(false);
    }
  }

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}
      <dialog
        ref={dialogRef}
        className="sheet"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          setPending(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <form
          onSubmit={onSubmit}
          className="relative w-full max-w-[440px] rounded-t-[24px] bg-surface px-5 pt-5 pb-[max(20px,env(safe-area-inset-bottom))] text-ink sm:rounded-[24px] sm:p-8"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-[26px] leading-tight font-bold tracking-[-0.03em]">
              {site.checkout.title}
            </h2>
            <button
              type="button"
              aria-label={site.checkout.close}
              className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-muted hover:bg-black/[0.04]"
              onClick={() => dialogRef.current?.close()}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4 rounded-[16px] bg-paper px-4 py-3">
            <p className="text-[14px] leading-snug text-muted">{productTitle}</p>
            <p className="shrink-0 text-[17px] font-semibold">{priceLabel ?? "—"}</p>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">{site.checkout.body}</p>
          <label className="mt-5 block text-[14px] font-medium" htmlFor="checkout-email">
            {site.checkout.emailLabel}
          </label>
          <input
            id="checkout-email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            placeholder={site.checkout.emailPlaceholder}
            className="field mt-2"
          />
          <p className="mt-2 text-[13px] text-subtle">{site.checkout.emailHint}</p>
          <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
            <label>
              Empresa
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error ? (
            <p role="alert" className="mt-4 text-[14px] text-danger">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary mt-5 w-full" disabled={pending || !priceLabel}>
            {pending ? site.checkout.submitting : site.checkout.submit}
          </button>
          {placeholderNotice ? (
            <p className="mt-3 text-[13px] leading-relaxed text-subtle">{placeholderNotice}</p>
          ) : null}
          {!priceLabel ? <p className="mt-3 text-[13px] text-subtle">{site.checkout.missingPrice}</p> : null}
        </form>
      </dialog>
    </CheckoutContext.Provider>
  );
}

export function BuyButton({
  children,
  className = "btn btn-primary",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openCheckout } = useCheckout();
  return (
    <button type="button" className={className} onClick={openCheckout}>
      {children}
    </button>
  );
}
