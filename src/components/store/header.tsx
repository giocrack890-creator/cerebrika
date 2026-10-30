"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { catalogHref, categories, isCategoryId } from "@/content/products";
import { site } from "@/content/site";
import { useCart } from "@/components/store/cart-provider";

function BuenosAiresClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(new Date());
    const update = () => setTime(format());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="pointer-events-none fixed right-8 bottom-24 z-40 hidden text-xs tracking-tight text-black/70 xl:block">
      {site.chrome.clockLabel}
      {time ? <time dateTime={time}> {time}</time> : null}
    </p>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2c1.4-3 3.8-4.4 7-4.4s5.6 1.4 7 4.4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.5 8h11l-.8 11.2a1 1 0 0 1-1 .8H8.3a1 1 0 0 1-1-.8L6.5 8Z" />
      <path d="M9 8V6.8A3 3 0 0 1 12 3.8 3 3 0 0 1 15 6.8V8" />
    </svg>
  );
}

const tabClass = "border-b-2 border-transparent pb-1 text-[12px] font-semibold tracking-[0.16em]";

export function StoreChrome({
  q = "",
  categoria = "",
  bar,
  corner,
  barAction,
  showBar = true,
}: {
  q?: string;
  categoria?: string;
  bar: string;
  corner: React.ReactNode;
  barAction: React.ReactNode;
  showBar?: boolean;
}) {
  const pathname = usePathname();
  const activeCategory = isCategoryId(categoria) ? categoria : "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const menuId = useId();
  const categoriesId = useId();
  const cart = useCart();

  const inicio = pathname === "/";
  const catalogo = pathname.startsWith("/catalogo") && !activeCategory;
  const quienes = pathname.startsWith("/quienes-somos");
  const contacto = pathname.startsWith("/contacto");

  const categoryLinks = (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={catalogHref({ categoria: category.id, q })}
            className="block rounded-full px-4 py-2 text-sm font-semibold tracking-[0.08em] hover:bg-black/5"
            aria-current={activeCategory === category.id ? "page" : undefined}
          >
            {category.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-50">
        <div className="flex items-center gap-6 bg-[#F5F2EB] px-4 py-4 sm:px-8">
          <Link href="/" className="shrink-0 text-[15px] font-bold tracking-[0.18em]">
            CEREBRIKA
            <sup className="ml-0.5 text-[9px] font-semibold tracking-normal">TM</sup>
          </Link>
          <nav aria-label="Secciones" className="hidden items-center gap-6 lg:flex">
            <Link href="/" aria-current={inicio ? "page" : undefined} className={`${tabClass} ${inicio ? "border-black" : "text-black/70"}`}>
              INICIO
            </Link>
            <Link href="/catalogo" aria-current={catalogo ? "page" : undefined} className={`${tabClass} ${catalogo ? "border-black" : "text-black/70"}`}>
              CATÁLOGO
            </Link>
            <div className="relative">
              <button
                type="button"
                className={`${tabClass} ${activeCategory ? "border-black" : "text-black/70"}`}
                aria-expanded={categoriesOpen}
                aria-controls={categoriesId}
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                CATEGORÍAS
              </button>
              {categoriesOpen ? (
                <div id={categoriesId} className="absolute top-full left-0 z-50 mt-3 min-w-52 rounded-[20px] bg-white p-3 shadow-[0_12px_40px_rgba(17,17,17,0.12)]">
                  {categoryLinks}
                </div>
              ) : null}
            </div>
            <Link href="/quienes-somos" aria-current={quienes ? "page" : undefined} className={`${tabClass} ${quienes ? "border-black" : "text-black/70"}`}>
              QUIÉNES SOMOS
            </Link>
            <Link href="/contacto" aria-current={contacto ? "page" : undefined} className={`${tabClass} ${contacto ? "border-black" : "text-black/70"}`}>
              CONTACTO
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block">{corner}</div>
            <Link href="/contacto" aria-label="Cuenta" className="hidden text-black sm:inline-flex">
              <PersonIcon />
            </Link>
            <button
              type="button"
              className="relative text-black"
              aria-label={cart.slugs.length === 0 ? "Bolsa vacía" : `Bolsa, ${cart.slugs.length} ebooks`}
              onClick={() => cart.openDrawer()}
            >
              <BagIcon />
              {cart.slugs.length > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                  {cart.slugs.length}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú</span>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        <p className="bg-black px-4 py-2 text-center text-[11px] font-semibold tracking-[0.14em] text-white">
          PAGO SEGURO MERCADO PAGO · EL PDF LLEGA POR MAIL · SIN SUSCRIPCIÓN
        </p>
      </header>
      {menuOpen ? (
        <div id={menuId} className="fixed inset-0 z-[70] flex flex-col bg-[#F5F2EB] px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold tracking-[0.18em]">
              CEREBRIKA<sup className="ml-0.5 text-[9px]">TM</sup>
            </p>
            <button type="button" className="text-[12px] font-semibold tracking-[0.16em]" onClick={() => setMenuOpen(false)}>
              CERRAR
            </button>
          </div>
          <nav aria-label="Secciones" className="mt-10 flex flex-col gap-5 text-2xl font-bold tracking-[-0.04em]">
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <p className="text-xs font-semibold tracking-[0.16em] text-black/50">CATEGORÍAS</p>
            {categories.map((category) => (
              <Link key={category.id} href={catalogHref({ categoria: category.id })} className="text-xl">
                {category.label}
              </Link>
            ))}
            <Link href="/quienes-somos">Quiénes somos</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
        </div>
      ) : null}
      {showBar ? (
        <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-4 shadow-[0_12px_40px_rgba(17,17,17,0.14)] lg:inset-x-auto lg:bottom-8 lg:left-1/2 lg:w-auto lg:-translate-x-1/2 lg:pl-6">
          <p className="min-w-0 flex-1 text-[13px] leading-tight font-medium tracking-[-0.03em] lg:max-w-sm lg:flex-none lg:text-[15px]">
            {bar}
          </p>
          {barAction}
        </div>
      ) : null}
      <BuenosAiresClock />
    </>
  );
}
