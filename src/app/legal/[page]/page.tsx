import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { site } from "@/content/site";

const pages = {
  terminos: {
    title: "Términos",
    body: "[A CONFIRMAR] Estos términos todavía no están redactados. No los tomes como un contrato.",
  },
  privacidad: {
    title: "Privacidad",
    body: "[A CONFIRMAR] Guardamos el email para entregar el ebook o un aviso del catálogo. Esta versión no lo manda a una herramienta de anuncios. Falta la política definitiva.",
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
    <>
      <StoreChrome
        bar={site.chrome.bar}
        showBar={false}
        corner={
          <Link href="/catalogo" className="rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white">
            CATÁLOGO
          </Link>
        }
        barAction={null}
      />
      <main id="inicio" className="mx-auto max-w-3xl px-6 pt-10 pb-24">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">A confirmar</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.9] font-bold tracking-[-0.055em]">{entry.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-black/75">{entry.body}</p>
      </main>
      <StoreFooter />
    </>
  );
}
