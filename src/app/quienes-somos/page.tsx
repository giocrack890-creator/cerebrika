import type { Metadata } from "next";
import Link from "next/link";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { getFlagship, resolvePriceArs } from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

export const metadata: Metadata = {
  title: `Quiénes somos · ${site.brand.name}`,
  description: site.brand.description,
};

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const barClass =
  "shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-white";

export default function AboutPage() {
  const flagship = getFlagship();
  const price = resolvePriceArs(flagship);
  const priceLabel = price ? formatArs(price) : null;

  return (
    <CheckoutProvider productSlug={flagship.slug} productTitle={flagship.title} priceLabel={priceLabel}>
      <StoreChrome
        bar={site.chrome.bar}
        corner={<BuyButton label={site.chrome.buy} className={cornerClass} />}
        barAction={<BuyButton label={site.chrome.barButton} className={barClass} />}
      />
      <main id="inicio" className="mx-auto max-w-3xl px-6 pt-10 pb-32">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">Cerebrika</p>
        <h1 className="mt-4 text-[clamp(2.8rem,7vw,5.2rem)] leading-[0.9] font-bold tracking-[-0.055em]">
          Ebooks cortos para un trabajo concreto.
        </h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-black/75">
          <p>
            Cerebrika publica ebooks cortos para usar un chat de IA en algo puntual: planificar una semana de clases,
            estudiar un tema, escribir un borrador, armar un menú.
          </p>
          <p>
            Hoy se puede comprar uno: <Link href={`/productos/${flagship.slug}`} className="font-semibold text-black">{flagship.title}</Link>.
            El resto del catálogo está anunciado y todavía no está a la venta. Si dejás el mail en la ficha, te avisamos cuando salga.
          </p>
          <p>El manuscrito del ebook de docentes sigue en preparación. La página lo dice antes de pagar.</p>
        </div>
      </main>
      <StoreFooter />
    </CheckoutProvider>
  );
}
