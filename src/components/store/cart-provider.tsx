"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BookCover } from "@/components/store/book-cover";
import { quoteCart, uniqueSlugs } from "@/lib/cart-math";
import { CloseIcon } from "@/components/ui/icons";
import { productParams, trackPixel } from "@/lib/analytics/meta-pixel";
import { getProduct, resolvePriceArs } from "@/content/products";
import { formatArs } from "@/lib/format";

const storageKey = "cerebrika-carrito";
const empty: string[] = [];
let current: string[] = empty;
let loaded = false;
const listeners = new Set<() => void>();

function readStored(): string[] {
  if (loaded) return current;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    current = uniqueSlugs(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []).filter(
      (slug) => getProduct(slug)?.status === "available",
    );
  } catch {
    current = empty;
  }
  return current;
}

function write(next: string[]) {
  current = next;
  loaded = true;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    /* el carrito sigue en memoria */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearStoredCart() {
  write(empty);
}

type CartContextValue = {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("Falta CartProvider.");
  return value;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const slugs = useSyncExternalStore(subscribe, readStored, () => empty);
  const [open, setOpen] = useState(false);
  const value = useMemo<CartContextValue>(
    () => ({
      slugs,
      add: (slug: string) => {
        const product = getProduct(slug);
        if (!product || product.status !== "available") return;
        write(uniqueSlugs([...readStored(), slug]));
      },
      remove: (slug: string) => write(readStored().filter((item) => item !== slug)),
      open,
      openDrawer: () => setOpen(true),
      closeDrawer: () => setOpen(false),
    }),
    [open, slugs],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { slugs, remove, open, closeDrawer } = useCart();
  const quote = quoteCart(slugs);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeDrawer]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-ink/40" role="presentation" onClick={closeDrawer}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className="drawer-in flex h-full w-full max-w-[400px] flex-col bg-paper text-ink"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-[22px] font-bold tracking-[-0.03em]">Carrito</h2>
          <button
            type="button"
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-[12px] text-muted hover:bg-black/[0.04]"
            onClick={closeDrawer}
          >
            <CloseIcon />
          </button>
        </div>
        {slugs.length === 0 || !quote.ok ? (
          <div className="flex flex-1 flex-col items-start px-5 py-8">
            <p className="text-[16px] text-muted">Todavía no agregaste ningún ebook.</p>
            <Link href="/catalogo" onClick={closeDrawer} className="btn btn-ghost btn-sm mt-4">
              Ver el catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {quote.lines.map((line) => {
                const product = getProduct(line.slug);
                return (
                  <li key={line.slug} className="flex gap-4 py-4">
                    {product ? (
                      <div className="w-14 shrink-0">
                        <BookCover product={product} compact />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] leading-snug font-medium">{line.title}</p>
                      <p className="mt-1 text-[14px] text-muted">{formatArs(line.unitPrice)}</p>
                      <button
                        type="button"
                        className="mt-2 text-[13px] font-medium text-subtle underline-offset-4 hover:text-ink hover:underline"
                        onClick={() => remove(line.slug)}
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <p className="text-[14px] text-muted">Subtotal</p>
                <p className="text-[18px] font-semibold">{formatArs(quote.subtotal)}</p>
              </div>
              <Link href="/carrito" onClick={closeDrawer} className="btn btn-primary mt-4 w-full">
                Ir a pagar
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function CartActions({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { add, openDrawer } = useCart();
  const router = useRouter();
  const product = getProduct(slug);
  const price = product ? resolvePriceArs(product) : null;

  function track() {
    if (product && price) trackPixel("AddToCart", productParams([{ slug, title: product.title, price }]));
  }

  return (
    <div className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
      <button
        type="button"
        className={`btn btn-primary ${compact ? "btn-sm" : ""}`}
        onClick={() => {
          add(slug);
          track();
          router.push("/carrito");
        }}
      >
        Comprar ahora
      </button>
      <button
        type="button"
        className={`btn btn-ghost ${compact ? "btn-sm" : ""}`}
        onClick={() => {
          add(slug);
          track();
          openDrawer();
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export function ClearCartOnMount() {
  useEffect(() => {
    clearStoredCart();
  }, []);
  return null;
}

export function AddToCartButton({ slug, className = "btn btn-ghost" }: { slug: string; className?: string }) {
  const { add, openDrawer, slugs } = useCart();
  const product = getProduct(slug);
  const price = product ? resolvePriceArs(product) : null;
  const inCart = slugs.includes(slug);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!inCart) {
          add(slug);
          if (product && price) trackPixel("AddToCart", productParams([{ slug, title: product.title, price }]));
        }
        openDrawer();
      }}
    >
      {inCart ? "Ya está en el carrito" : "Agregar al carrito"}
    </button>
  );
}

/** Después de un pago fallido: vuelve al carrito si tiene algo, si no a la ficha del destacado. */
export function RetryPaymentLink({ label, fallbackHref }: { label: string; fallbackHref: string }) {
  const { slugs } = useCart();
  return (
    <Link href={slugs.length > 0 ? "/carrito" : fallbackHref} className="btn btn-primary">
      {label}
    </Link>
  );
}
