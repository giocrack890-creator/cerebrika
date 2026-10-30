import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { storeConfig } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsappNumber } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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

const pageTitle = `${site.brand.name} · Ebooks de IA`;

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsapp = getWhatsappNumber();
  const announcement = storeConfig.announcement.trim();
  return (
    <html lang="es-AR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-[#F5F2EB] text-[#111111]">
        {announcement ? (
          <p className="bg-black px-4 py-2 text-center text-[11px] font-semibold tracking-[0.14em] text-white">{announcement}</p>
        ) : null}
        {children}
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            className="fixed right-4 bottom-24 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-[10px] font-bold tracking-tight text-white"
            aria-label="Escribir por WhatsApp"
          >
            WA
          </a>
        ) : null}
      </body>
    </html>
  );
}
