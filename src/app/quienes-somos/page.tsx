import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/landing/text-page";
import { getFlagship } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Quiénes somos · ${site.brand.name}`,
  description: site.brand.description,
};

export default function AboutPage() {
  const flagship = getFlagship();

  return (
    <TextPage kicker="Cerebrika" title="Ebooks cortos para un trabajo concreto">
      <p>
        Cerebrika publica ebooks cortos para usar un chat de IA en algo puntual: planificar una semana de clases, estudiar un
        tema, escribir un borrador, armar un menú.
      </p>
      <p>
        Hoy se puede comprar uno: <Link href={`/productos/${flagship.slug}`}>{flagship.title}</Link>. El resto del catálogo
        está anunciado y todavía no está a la venta. Si dejás el mail en la ficha, te avisamos cuando salga.
      </p>
    </TextPage>
  );
}
