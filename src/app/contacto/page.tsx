import type { Metadata } from "next";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { getFlagship, resolvePriceArs } from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

export const metadata: Metadata = {
  title: `Contacto · ${site.brand.name}`,
  description: "Escribinos por el ebook o por un aviso del catálogo.",
};

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const barClass =
  "shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-white";

export default function ContactPage() {
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
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">Contacto</p>
        <h1 className="mt-4 text-[clamp(2.8rem,7vw,5.2rem)] leading-[0.9] font-bold tracking-[-0.055em]">
          Escribinos.
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-black/75">
          No hay cuenta de usuario. El ebook llega al mail con el que pagás. Si el enlace se vence o no aparece, respondé ese mail.
        </p>
        <p className="mt-6 text-lg font-semibold">{site.footer.contact}</p>
        <p className="mt-2 text-sm text-black/60">{site.footer.seller}</p>
      </main>
      <StoreFooter />
    </CheckoutProvider>
  );
}
