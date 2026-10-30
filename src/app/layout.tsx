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
  return (
    <html lang="es-AR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-[#F5F2EB] text-[#111111]">{children}</body>
    </html>
  );
}
