"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";

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

export function CheckoutProvider({
  children,
  priceLabel,
  productSlug,
  productTitle,
}: {
  children: React.ReactNode;
  priceLabel: string | null;
  productSlug: string;
  productTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function openCheckout() {
    setError(null);
    setOpen(true);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!priceLabel) {
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
        className="checkout-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          setPending(false);
        }}
      >
          <form
          onSubmit={onSubmit}
          className="relative w-full max-w-[440px] rounded-[28px] bg-[#FBF8F3] p-8 text-[#1C1714] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-3xl tracking-[-0.03em]">
              {site.checkout.title}
            </h2>
            <button
              type="button"
              className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold"
              onClick={() => dialogRef.current?.close()}
            >
              {site.checkout.close}
            </button>
          </div>
          <p className="mt-3 text-base leading-relaxed text-[#5E564E]">{productTitle}</p>
          <p className="mt-2 text-base leading-relaxed text-[#5E564E]">{site.checkout.body}</p>
          <p className="mt-5 text-sm font-semibold tracking-tight">
            {site.checkout.priceLabel}
            {priceLabel ? ` · ${priceLabel}` : ""}
          </p>
          <label className="mt-5 block text-sm font-medium" htmlFor="checkout-email">
            {site.checkout.emailLabel}
          </label>
          <input
            id="checkout-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={site.checkout.emailPlaceholder}
            className="mt-2 w-full rounded-full border border-black/10 bg-[#F3EEE6] px-5 py-3 text-base outline-none"
          />
          <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
            <label>
              Empresa
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error ? (
            <p role="alert" className="mt-4 text-sm text-[#8E3F2A]">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary mt-6 w-full px-5 py-3.5 text-[15px]" disabled={pending || !priceLabel}>
            {pending ? site.checkout.submitting : site.checkout.submit}
          </button>
          {!priceLabel ? <p className="mt-3 text-sm text-[#5E564E]">{site.checkout.missingPrice}</p> : null}
        </form>
      </dialog>
    </CheckoutContext.Provider>
  );
}

export function BuyButton({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const { openCheckout } = useCheckout();
  return (
    <button type="button" className={className} onClick={openCheckout}>
      {label}
    </button>
  );
}
