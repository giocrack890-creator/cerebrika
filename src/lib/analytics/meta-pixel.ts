/**
 * Píxel de Meta. Se activa solo si NEXT_PUBLIC_META_PIXEL_ID tiene un id numérico.
 * Sin id, cada función es un no-op: el sitio funciona igual y no carga nada de Meta.
 *
 * No mandamos el email ni datos personales al píxel. Solo eventos con
 * id de producto, valor y moneda.
 */

export type PixelEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

export type PixelParams = {
  content_ids?: string[];
  content_name?: string;
  content_type?: "product";
  value?: number;
  currency?: string;
  num_items?: number;
};

type Fbq = ((command: "track", event: PixelEvent, params?: PixelParams, options?: { eventID?: string }) => void) & {
  queue?: unknown[];
};

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function parsePixelId(raw: string | undefined): string | null {
  const value = raw?.trim() ?? "";
  return /^\d{6,20}$/.test(value) ? value : null;
}

export function getPixelId(): string | null {
  return parsePixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}

type Pending = { event: PixelEvent; params?: PixelParams; eventId?: string };

/** Eventos que llegan antes de que cargue el snippet (por ejemplo, ViewContent al hidratar). */
const pending: Pending[] = [];

function send({ event, params, eventId }: Pending) {
  if (eventId) window.fbq?.("track", event, params, { eventID: eventId });
  else window.fbq?.("track", event, params);
}

export function trackPixel(event: PixelEvent, params?: PixelParams, eventId?: string): void {
  if (typeof window === "undefined" || !getPixelId()) return;
  if (typeof window.fbq !== "function") {
    pending.push({ event, params, eventId });
    return;
  }
  send({ event, params, eventId });
}

export function flushPixelQueue(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  for (const item of pending.splice(0)) send(item);
}

/** Parámetros estándar de un producto, siempre en pesos. */
export function productParams(items: readonly { slug: string; title: string; price: number }[]): PixelParams {
  return {
    content_ids: items.map((item) => item.slug),
    content_name: items.length === 1 ? items[0].title : undefined,
    content_type: "product",
    value: items.reduce((sum, item) => sum + item.price, 0),
    currency: "ARS",
    num_items: items.length,
  };
}

/** Snippet oficial de Meta, con el id ya validado. */
export function pixelBootstrap(pixelId: string): string {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');`;
}
