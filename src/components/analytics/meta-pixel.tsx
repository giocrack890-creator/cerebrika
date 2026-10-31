"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  flushPixelQueue,
  getPixelId,
  pixelBootstrap,
  productParams,
  trackPixel,
  type PixelEvent,
} from "@/lib/analytics/meta-pixel";

/** Carga el píxel y manda PageView en la carga inicial y en cada cambio de ruta. */
export function MetaPixel() {
  const pixelId = getPixelId();
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pixelId) return;
    // La carga inicial la cuenta el snippet. Acá solo las navegaciones del lado del cliente.
    if (first.current) {
      first.current = false;
      return;
    }
    trackPixel("PageView");
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={flushPixelQueue}>
        {`${pixelBootstrap(pixelId)}fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}

/** Dispara un evento de producto una sola vez al montar (ViewContent en la ficha, Purchase en el éxito). */
export function TrackProductEvent({
  event,
  items,
  eventId,
}: {
  event: Extract<PixelEvent, "ViewContent" | "Purchase">;
  items: { slug: string; title: string; price: number }[];
  eventId?: string;
}) {
  const sent = useRef(false);
  const key = items.map((item) => `${item.slug}:${item.price}`).join(",");

  useEffect(() => {
    if (sent.current || !key) return;
    sent.current = true;
    // Un Purchase por pago, aunque la persona recargue la página de éxito.
    const guard = event === "Purchase" && eventId ? `cerebrika-purchase-${eventId}` : null;
    if (guard) {
      try {
        if (window.localStorage.getItem(guard)) return;
        window.localStorage.setItem(guard, "1");
      } catch {
        /* sin almacenamiento, el eventID igual le permite a Meta deduplicar */
      }
    }
    trackPixel(event, productParams(items), eventId);
    // items se resume en key: no hace falta repetir el evento si cambia la referencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key, eventId]);

  return null;
}
