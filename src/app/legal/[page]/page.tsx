import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TextPage } from "@/components/landing/text-page";
import Link from "next/link";
import { legalPages } from "@/content/legal";
import { isPlaceholder, site } from "@/content/site";
import { getDownloadTtlHours } from "@/lib/env";

const pages = legalPages;

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

  const seller = [site.footer.seller, site.footer.tax, site.footer.contact].filter((value) => !isPlaceholder(value));
  const ttl = String(getDownloadTtlHours());

  return (
    <TextPage kicker="Legal" title={entry.title}>
      <p className="text-[14px] text-subtle">Actualizado el {entry.updated}.</p>
      {entry.sections.map((section) => (
        <section key={section.heading} className="pt-2">
          <h2 className="font-display text-[20px] font-extrabold tracking-[-0.015em] text-ink">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-2 font-serif">
              {paragraph.replaceAll("{ttl}", ttl)}
            </p>
          ))}
        </section>
      ))}
      <section className="pt-2">
        <h2 className="font-display text-[20px] font-extrabold tracking-[-0.015em] text-ink">Contacto</h2>
        <p className="mt-2 font-serif">
          {seller.length > 0 ? `${seller.join(" · ")}. ` : ""}También podés responder cualquier mail de la compra o usar el{" "}
          <Link href="/arrepentimiento">Botón de arrepentimiento</Link>.
        </p>
      </section>
    </TextPage>
  );
}
