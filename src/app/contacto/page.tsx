import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/landing/text-page";
import { isPlaceholder, site } from "@/content/site";

export const metadata: Metadata = {
  title: `Contacto · ${site.brand.name}`,
  description: "Escribinos por un ebook, un pago o un enlace de descarga.",
};

export default function ContactPage() {
  const contact = isPlaceholder(site.footer.contact) ? null : site.footer.contact;
  const seller = isPlaceholder(site.footer.seller) ? null : site.footer.seller;

  return (
    <TextPage kicker="Contacto" title="Escribinos">
      <p>
        No hay cuenta de usuario: el ebook llega al mail con el que pagás. Si el enlace se venció, lo pedís de nuevo desde{" "}
        <Link href="/cuenta">Mis compras</Link>.
      </p>
      <p>Para cualquier otra consulta, respondé el mail de la compra{contact ? " o escribinos a:" : "."}</p>
      {contact ? (
        <p className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink">
          <a href={`mailto:${contact}`}>{contact}</a>
        </p>
      ) : null}
      {seller ? <p className="text-[14px] text-subtle">{seller}</p> : null}
    </TextPage>
  );
}
