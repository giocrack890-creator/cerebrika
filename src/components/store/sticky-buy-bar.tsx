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
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-[var(--ease-out-soft)] lg:bottom-6 lg:px-0 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-[16px] bg-surface py-2 pr-2 pl-4 shadow-[0_0_0_1px_var(--line),0_16px_40px_-12px_rgba(21,20,26,0.25)]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium">{title}</p>
          <p className="text-[13px] text-muted">{detail}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
