import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source",
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
    <html lang="es-AR" className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F3EEE6] font-sans text-[#1C1714]">{children}</body>
    </html>
  );
}
