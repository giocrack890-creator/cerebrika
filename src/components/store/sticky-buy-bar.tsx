"use client";

import { useEffect, useState } from "react";

/**
 * Barra de compra fija abajo. Aparece cuando el botón principal (watchId) sale de la pantalla,
 * así no compite con el hero y siempre queda un CTA a mano en el celular.
 */
export function StickyBuyBar({
  watchId,
  title,
  detail,
  children,
}: {
  watchId: string;
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-accent px-5 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] text-white shadow-[0_-12px_32px_-16px_rgba(31,30,36,0.5)] transition-[transform,opacity] duration-300 ease-[var(--ease-out-soft)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-[680px] flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-center text-[14px] leading-snug font-semibold sm:flex-1 sm:text-left">
          {title}
          <span className="font-normal text-white/75"> · {detail}</span>
        </p>
        {children}
      </div>
    </div>
  );
}
