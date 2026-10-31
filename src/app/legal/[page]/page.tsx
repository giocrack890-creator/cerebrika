import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TextPage } from "@/components/landing/text-page";
import { site } from "@/content/site";

const pages = {
  terminos: {
    title: "Términos",
    body: "[A CONFIRMAR] Estos términos todavía no están redactados. No los tomes como un contrato.",
  },
  privacidad: {
    title: "Privacidad",
    body: "[A CONFIRMAR] Guardamos el email para entregar el ebook o un aviso del catálogo, y no lo compartimos con herramientas de anuncios. Para medir los anuncios, el sitio puede usar el píxel de Meta, que registra visitas y compras con cookies propias de Meta. Falta la política definitiva.",
  },
  reembolsos: {
    title: "Política de reembolso",
    body: "[A CONFIRMAR] El pago entra por Mercado Pago y esta tienda no procesa devoluciones automáticas. Definí la política antes de prometer un reembolso.",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const entry = pages[page as keyof typeof pages];
  return { title: entry ? `${entry.title} · ${site.brand.name}` : site.brand.name };
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const entry = pages[page as keyof typeof pages];
  if (!entry) notFound();

  return (
    <TextPage kicker="A confirmar" title={entry.title}>
      <p>{entry.body}</p>
    </TextPage>
  );
}
