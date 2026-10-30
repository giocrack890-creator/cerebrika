"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogHref, categories, isCategoryId } from "@/content/products";
import { site } from "@/content/site";

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

export function StoreChrome({
  q = "",
  categoria = "",
  bar,
  corner,
  barAction,
}: {
  q?: string;
  categoria?: string;
  bar: string;
  corner: React.ReactNode;
  barAction: React.ReactNode;
}) {
  const active = isCategoryId(categoria) ? categoria : "";

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold tracking-[-0.06em] text-[#F5F2EB] lg:left-6 lg:top-6"
        aria-label={site.chrome.brand}
      >
        C
      </Link>
      <div className="fixed top-5 right-4 z-50 hidden sm:block lg:right-6 lg:top-7">{corner}</div>
      <form
        action="/"
        method="get"
        role="search"
        className="fixed top-[4.6rem] right-4 left-4 z-40 sm:top-5 sm:right-auto sm:left-20 sm:w-52"
      >
        {active ? <input type="hidden" name="categoria" value={active} /> : null}
        <label className="sr-only" htmlFor="catalogo-q">
          Buscar ebooks
        </label>
        <input
          id="catalogo-q"
          name="q"
          defaultValue={q}
          placeholder="Buscar"
          className="w-full rounded-full bg-white px-4 py-2.5 text-sm shadow-[0_12px_40px_rgba(17,17,17,0.12)] outline-none"
        />
      </form>
      <nav
        aria-label="Categorías"
        className="fixed top-1/2 left-6 z-50 hidden -translate-y-1/2 flex-col gap-1 rounded-full bg-white p-2 shadow-[0_12px_40px_rgba(17,17,17,0.12)] xl:flex"
      >
        <Link
          href={catalogHref({ q })}
          aria-label="Todo el catálogo"
          aria-current={active ? undefined : "true"}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-[10px] font-bold tracking-tight ${active ? "hover:bg-black/5" : "bg-black text-white"}`}
        >
          TD
        </Link>
        {categories.map((category) => {
          const selected = active === category.id;
          return (
            <Link
              key={category.id}
              href={catalogHref({ categoria: category.id, q })}
              aria-label={category.label}
              aria-current={selected ? "true" : undefined}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-[10px] font-bold tracking-tight ${selected ? "bg-black text-white" : "hover:bg-black/5"}`}
            >
              {category.label.slice(0, 2).toUpperCase()}
            </Link>
          );
        })}
      </nav>
      <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-4 shadow-[0_12px_40px_rgba(17,17,17,0.14)] lg:inset-x-auto lg:bottom-8 lg:left-1/2 lg:w-auto lg:-translate-x-1/2 lg:pl-6">
        <p className="min-w-0 flex-1 text-[13px] leading-tight font-medium tracking-[-0.03em] lg:max-w-sm lg:flex-none lg:text-[15px]">
          {bar}
        </p>
        {barAction}
      </div>
      <p className="pointer-events-none fixed bottom-8 left-8 z-40 hidden text-xs tracking-tight text-black/70 lg:block">
        {site.chrome.brand}
      </p>
      <BuenosAiresClock />
    </>
  );
}
