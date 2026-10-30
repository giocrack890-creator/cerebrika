import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/content/site";
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

export const metadata: Metadata = {
  title: site.product.title,
  description: site.hero.subtitle,
  ...(base ? { metadataBase: base } : {}),
  openGraph: {
    title: site.product.title,
    description: site.hero.subtitle,
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-[#F5F2EB] text-[#111111]">{children}</body>
    </html>
  );
}
