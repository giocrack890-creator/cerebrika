import type { Metadata, Viewport } from "next";
import { Inter_Tight, Literata } from "next/font/google";
import { Suspense } from "react";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { CartProvider } from "@/components/store/cart-provider";
import { storeConfig } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsappNumber } from "@/lib/env";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

function metadataBase(): URL | undefined {
  const raw = process.env.SITE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

const base = metadataBase();

const pageTitle = `${site.brand.name} · Ebooks cortos de IA`;

export const metadata: Metadata = {
  title: pageTitle,
  description: site.brand.description,
  applicationName: site.brand.name,
  ...(base ? { metadataBase: base } : {}),
  openGraph: {
    title: pageTitle,
    description: site.brand.description,
    siteName: site.brand.name,
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f1e24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsapp = getWhatsappNumber();
  const announcement = storeConfig.announcement.trim();
  return (
    <html lang="es-AR" className={`${interTight.variable} ${literata.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">
        {announcement ? (
          <p className="bg-accent px-4 py-2 text-center text-[13px] font-medium text-white">{announcement}</p>
        ) : null}
        <CartProvider>{children}</CartProvider>
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            className="fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition-transform active:scale-95"
            aria-label="Escribir por WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20Z" strokeLinejoin="round" />
            </svg>
          </a>
        ) : null}
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
      </body>
    </html>
  );
}
