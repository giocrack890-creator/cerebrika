import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { LeadForm } from "@/components/landing/lead-form";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import {
  catalogHref,
  categories,
  categoryLabel,
  filterProducts,
  getFlagship,
  isCategoryId,
  resolvePriceArs,
} from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const barClass =
  "shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-white";

type Query = { q?: string | string[]; categoria?: string | string[] };

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 80);
}

export default function HomePage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <Suspense fallback={null}>
      <LiveHome searchParams={searchParams} />
    </Suspense>
  );
}

async function LiveHome({ searchParams }: { searchParams: Promise<Query> }) {
  await connection();
  const params = await searchParams;
  const q = one(params.q);
  const categoria = one(params.categoria);
  const activeCategory = isCategoryId(categoria) ? categoria : "";
  const filtered = filterProducts({ q, categoria: activeCategory });
  const browsing = Boolean(q || activeCategory);
  const flagship = getFlagship();
  const price = resolvePriceArs(flagship);
  const priceLabel = price ? formatArs(price) : null;

  return (
    <CheckoutProvider productSlug={flagship.slug} productTitle={flagship.title} priceLabel={priceLabel}>
      <StoreChrome
        q={q}
        categoria={activeCategory}
        bar={priceLabel ? `${site.chrome.bar} · ${priceLabel}` : site.chrome.bar}
        corner={<BuyButton label={site.chrome.buy} className={cornerClass} />}
        barAction={<BuyButton label={site.chrome.barButton} className={barClass} />}
      />
      <main className="px-3 pt-28 pb-28 sm:px-6 lg:px-10 xl:pl-28">
        {browsing ? (
          <section id="inicio" className="px-3 pt-6 pb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase">Catálogo</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.88] font-bold tracking-[-0.055em]">
              {activeCategory ? categoryLabel(activeCategory) : "Resultados"}
              {q ? ` · ${q}` : ""}
            </h1>
            <p className="mt-5 text-black/70">
              {filtered.length === 0
                ? "Ningún ebook coincide. Probá otra palabra."
                : `${filtered.length} ${filtered.length === 1 ? "ebook" : "ebooks"}.`}
            </p>
          </section>
        ) : (
          <section id="inicio" className="flex min-h-[88svh] flex-col items-center justify-center px-3 pb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase">Cerebrika · tienda de ebooks</p>
            <h1 className="mt-6 max-w-5xl text-[clamp(3.1rem,8.6vw,7.4rem)] leading-[0.88] font-bold tracking-[-0.055em]">
              Ebooks cortos para usar la IA.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">
              El de docentes ya se compra. Los demás están en camino: te avisamos, sin cobrar.
            </p>
            <p className="mt-6 text-sm font-medium tracking-tight">
              {priceLabel ? `${site.checkout.priceLabel} · ${priceLabel}` : site.checkout.missingPrice}
            </p>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.16em]">MERCADO PAGO · LLEGA POR MAIL · PAGO ÚNICO</p>
          </section>
        )}
        <nav aria-label="Categorías" className="mb-6 flex gap-2 overflow-x-auto px-1 pb-2">
          <Link href="/catalogo" className="shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white">
            CATÁLOGO
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={catalogHref({ categoria: category.id })}
              className="shrink-0 rounded-full bg-white px-4 py-3 text-[11px] font-semibold tracking-[0.14em]"
            >
              {category.label.toUpperCase()}
            </Link>
          ))}
        </nav>
        <ProductCard product={flagship} />
        <p className="px-2 py-6">
          <Link href="/catalogo" className={barClass}>
            VER LOS {filtered.length} EBOOKS →
          </Link>
        </p>
        <LeadForm />
        <StoreFooter />
      </main>
    </CheckoutProvider>
  );
}
