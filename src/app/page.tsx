import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { LeadForm } from "@/components/landing/lead-form";
import { CoverScene } from "@/components/store/cover";
import { StoreFooter } from "@/components/store/footer";
import { StoreHeader } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import { TrustStrip } from "@/components/store/trust";
import {
  categoryLabel,
  filterProducts,
  getFlagship,
  isCategoryId,
  products,
  resolvePriceArs,
} from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

type Query = { q?: string | string[]; categoria?: string | string[] };

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 80);
}

export default function HomePage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <Suspense fallback={<StoreHeader />}>
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
  const destacados = products.filter((product) => product.status === "available");
  const nuevos = products.filter((product) => product.status === "coming_soon");

  return (
    <CheckoutProvider productSlug={flagship.slug} productTitle={flagship.title} priceLabel={priceLabel}>
      <StoreHeader q={q} categoria={activeCategory} />
      <main>
        {browsing ? (
          <section className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#6B4F3B] uppercase">Catálogo</p>
            <h1 className="font-display mt-3 text-[clamp(2.2rem,5vw,3.8rem)] tracking-[-0.03em]">
              {activeCategory ? categoryLabel(activeCategory) : "Resultados"}
              {q ? `: ${q}` : ""}
            </h1>
            <p className="mt-3 text-[#5E564E]">
              {filtered.length === 0
                ? "Ningún ebook coincide. Probá otra palabra o volvé a todo el catálogo."
                : `${filtered.length} ${filtered.length === 1 ? "ebook" : "ebooks"}.`}
            </p>
            {filtered.length === 0 ? (
              <Link href="/" className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4">
                Ver todo
              </Link>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero-wash mx-auto grid max-w-[1120px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.2em] text-[#6B4F3B] uppercase">Destacado · Docentes</p>
                <h1 className="font-display mt-3 max-w-[14ch] text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.96] tracking-[-0.035em]">
                  {flagship.promise}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3F3832]">{flagship.description}</p>
                <p className="mt-5 text-sm font-semibold">{priceLabel ? `Pago único · ${priceLabel}` : site.checkout.missingPrice}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <BuyButton label="Comprar" className="btn btn-primary px-6 py-3.5 text-[16px]" />
                  <Link href={`/productos/${flagship.slug}`} className="btn btn-secondary px-5 py-3.5 text-[15px]">
                    Ver el ebook
                  </Link>
                </div>
              </div>
              <Link href={`/productos/${flagship.slug}`} aria-label={flagship.title}>
                <CoverScene product={flagship} />
              </Link>
            </section>
            <TrustStrip />
            <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">Destacado</h2>
              <p className="mt-2 max-w-xl text-[#5E564E]">El único ebook que ya se puede comprar.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-md">
                {destacados.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
            <section className="mx-auto max-w-[1120px] px-4 pb-4 sm:px-6">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">Nuevo en el catálogo</h2>
              <p className="mt-2 max-w-xl text-[#5E564E]">Todavía no están a la venta. En cada ficha podés pedir que te avisemos.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {nuevos.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
            <section id="catalogo" className="mx-auto max-w-[1120px] scroll-mt-28 px-4 py-12 sm:px-6">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">Todos los ebooks</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
        <LeadForm />
        <StoreFooter />
      </main>
    </CheckoutProvider>
  );
}
