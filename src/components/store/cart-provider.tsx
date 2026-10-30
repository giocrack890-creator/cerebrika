"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BookCover } from "@/components/store/book-cover";
import { quoteCart, uniqueSlugs } from "@/lib/cart-math";
import { getProduct } from "@/content/products";
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/40" role="presentation" onClick={closeDrawer}>
      <aside
        role="dialog"
        aria-label="Carrito"
        className="flex h-full w-full max-w-md flex-col bg-[#F5F2EB] p-6 text-[#111111]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-[-0.045em]">Carrito</h2>
          <button type="button" className="text-[11px] font-semibold tracking-[0.14em]" onClick={closeDrawer}>
            CERRAR
          </button>
        </div>
        {slugs.length === 0 || !quote.ok ? (
          <p className="mt-8 text-lg text-black/70">La bolsa está vacía. Cada ebook se agrega una sola vez.</p>
        ) : (
          <ul className="mt-6 flex-1 space-y-4 overflow-y-auto">
            {quote.lines.map((line) => {
              const product = getProduct(line.slug);
              return (
                <li key={line.slug} className="flex gap-3">
                  {product ? (
                    <div className="w-14 shrink-0">
                      <BookCover product={product} compact />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold tracking-[-0.02em]">{line.title}</p>
                    <p className="text-sm">{formatArs(line.unitPrice)}</p>
                    <button type="button" className="mt-1 text-[11px] font-semibold tracking-[0.12em]" onClick={() => remove(line.slug)}>
                      QUITAR
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-lg font-bold">{quote.ok ? `Subtotal ${formatArs(quote.subtotal)}` : ""}</p>
        <Link
          href="/carrito"
          onClick={closeDrawer}
          className="mt-4 inline-flex justify-center rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white"
        >
          VER CARRITO
        </Link>
      </aside>
    </div>
  );
}

export function CartActions({ slug, onDark = false }: { slug: string; onDark?: boolean }) {
  const { add, openDrawer } = useCart();
  const router = useRouter();
  const className = onDark
    ? "rounded-full bg-white px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-black"
    : "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white";
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={className}
        onClick={() => {
          add(slug);
          openDrawer();
        }}
      >
        AGREGAR AL CARRITO
      </button>
      <button
        type="button"
        className={className}
        onClick={() => {
          add(slug);
          router.push("/carrito");
        }}
      >
        COMPRAR AHORA
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
