"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { categories, catalogHref } from "@/content/products";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/cuenta", label: "Mis compras" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-display text-[18px] font-black tracking-[-0.03em] ${className}`}>
      cerebrika
    </Link>
  );
}

/**
 * Encabezado fijo. `cta` aparece solo desde tablet: en el celular la compra
 * vive en el hero y en la barra inferior.
 */
export function SiteHeader({ cta }: { cta?: React.ReactNode }) {
  const pathname = usePathname();
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const count = cart.slugs.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-[12px] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <header
        className={`sticky top-0 z-50 text-white transition-[background-color,box-shadow] duration-200 ${
          scrolled ? "bg-night/95 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md" : "bg-night"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5 sm:px-8">
          <Logo />
          <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[14px] font-semibold transition-colors ${active ? "text-white" : "text-white/65 hover:text-white"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {cta ? <div className="hidden sm:block">{cta}</div> : null}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors hover:bg-white/10"
              aria-label={count === 0 ? "Carrito vacío" : `Carrito, ${count} ${count === 1 ? "ebook" : "ebooks"}`}
              onClick={() => cart.openDrawer()}
            >
              <BagIcon />
              {count > 0 ? (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-bright px-1 text-[10px] font-bold text-night">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors hover:bg-white/10 md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      {menuOpen ? (
        <div id={menuId} role="dialog" aria-modal="true" aria-label="Menú" className="fixed inset-0 z-[70] flex flex-col bg-paper md:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <Logo />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[12px] hover:bg-black/[0.04]"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Principal" className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display rise-in border-b border-line py-4 text-[28px] font-bold tracking-[-0.03em]"
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-8 text-[13px] font-medium text-subtle">Categorías</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={catalogHref({ categoria: category.id })}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-surface px-4 py-2 text-[14px] font-medium shadow-[inset_0_0_0_1px_var(--line)]"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

/** Botón del carrito suelto, para la barra oscura del hero. */
export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const count = cart.slugs.length;
  return (
    <button
      type="button"
      className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors ${className}`}
      aria-label={count === 0 ? "Carrito vacío" : `Carrito, ${count} ${count === 1 ? "ebook" : "ebooks"}`}
      onClick={() => cart.openDrawer()}
    >
      <BagIcon />
      {count > 0 ? (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-bright px-1 text-[10px] font-bold text-night">
          {count}
        </span>
      ) : null}
    </button>
  );
}
