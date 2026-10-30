"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { BuyButton } from "@/components/landing/checkout";

const navIcons = {
  home: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14" />
      <path d="M12 17h.01" />
    </svg>
  ),
} as const;

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#111111" />
      <path d="M32 32 L32 10 A22 22 0 0 1 54 32 Z" fill="#3730A3" />
      <path d="M32 32 L54 32 A22 22 0 0 1 32 54 Z" fill="#EA580C" />
      <path d="M32 32 L32 54 A22 22 0 0 1 10 32 Z" fill="#DC2626" />
      <path d="M32 32 L10 32 A22 22 0 0 1 32 10 Z" fill="#6B4F3B" />
    </svg>
  );
}

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
    <p className="pointer-events-none fixed bottom-8 right-8 z-40 hidden text-xs tracking-tight text-black/70 lg:block">
      {site.chrome.clockLabel}
      {time ? <time dateTime={time}> {time}</time> : null}
    </p>
  );
}

export function SiteChrome() {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    document.documentElement.dataset.hydrated = "1";
  }, []);

  useEffect(() => {
    const nodes = site.chrome.nav
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          )[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <a href="#inicio" className="fixed left-4 top-4 z-50 lg:left-6 lg:top-6" aria-label={site.chrome.brand}>
        <LogoMark />
      </a>
      <BuyButton
        label={site.chrome.buy}
        className="fixed right-4 top-5 z-50 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white lg:right-6 lg:top-7 lg:px-5"
      />
      <nav
        aria-label="Secciones"
        className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-1 rounded-full bg-white p-2 shadow-[0_12px_40px_rgba(17,17,17,0.12)] lg:flex"
      >
        {site.chrome.nav.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            aria-current={active === item.id ? "true" : undefined}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              active === item.id ? "bg-black text-white" : "text-black hover:bg-black/5"
            }`}
          >
            {navIcons[item.icon]}
          </a>
        ))}
      </nav>
      <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 shadow-[0_12px_40px_rgba(17,17,17,0.14)] lg:inset-x-auto lg:bottom-8 lg:left-1/2 lg:w-auto lg:-translate-x-1/2 lg:pl-6">
        <p className="min-w-0 flex-1 text-[13px] font-medium leading-tight tracking-[-0.03em] lg:max-w-none lg:flex-none lg:text-[15px]">
          {site.chrome.bar}
        </p>
        <BuyButton
          label={site.chrome.barButton}
          className="shrink-0 whitespace-nowrap rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white lg:px-5"
        />
      </div>
      <p className="pointer-events-none fixed bottom-8 left-8 z-40 hidden text-xs tracking-tight text-black/70 lg:block">
        {site.chrome.brand}
      </p>
      <BuenosAiresClock />
    </>
  );
}
