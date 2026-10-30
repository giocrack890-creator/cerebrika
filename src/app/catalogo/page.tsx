import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
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
  isSortId,
  resolvePriceArs,
  type SortId,
} from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const barClass =
  "shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-white";

const sorts: { id: SortId; label: string }[] = [
  { id: "destacados", label: "DESTACADOS" },
  { id: "precio", label: "PRECIO" },
  { id: "titulo", label: "A–Z" },
  { id: "lectura", label: "LECTURA" },
];

type Query = { q?: string | string[]; categoria?: string | string[]; orden?: string | string[] };

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 80);
}

export default function CatalogPage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <Suspense fallback={null}>
      <LiveCatalog searchParams={searchParams} />
    </Suspense>
  );
}

async function LiveCatalog({ searchParams }: { searchParams: Promise<Query> }) {
  await connection();
  const params = await searchParams;
  const q = one(params.q);
  const categoria = one(params.categoria);
  const ordenRaw = one(params.orden);
  const orden = isSortId(ordenRaw) ? ordenRaw : "destacados";
  const activeCategory = isCategoryId(categoria) ? categoria : "";
  const filtered = filterProducts({ q, categoria: activeCategory, orden });
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
      <main className="px-3 pt-32 pb-32 sm:px-6 lg:px-10 xl:pl-28">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">Cerebrika</p>
        <h1 className="mt-3 max-w-4xl text-[clamp(3rem,7vw,6rem)] leading-[0.88] font-bold tracking-[-0.055em]">
          {activeCategory ? categoryLabel(activeCategory) : "El catálogo"}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-black/70">
          {filtered.length} {filtered.length === 1 ? "ebook" : "ebooks"}.
          {q ? ` Búsqueda: ${q}.` : ""} Solo el de docentes se puede comprar.
        </p>
        <nav aria-label="Filtrar categorías" className="mt-8 flex gap-2 overflow-x-auto pb-2">
          <Link
            href={catalogHref({ q, orden })}
            className={`shrink-0 rounded-full px-4 py-3 text-[11px] font-semibold tracking-[0.14em] ${activeCategory ? "bg-white" : "bg-black text-white"}`}
          >
            TODOS
          </Link>
          {categories.map((category) => {
            const selected = activeCategory === category.id;
            return (
              <Link
                key={category.id}
                href={catalogHref({ categoria: category.id, q, orden })}
                aria-current={selected ? "page" : undefined}
                className={`shrink-0 rounded-full px-4 py-3 text-[11px] font-semibold tracking-[0.14em] ${selected ? "bg-black text-white" : "bg-white"}`}
              >
                {category.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Ordenar">
          {sorts.map((sort) => (
            <Link
              key={sort.id}
              href={catalogHref({ categoria: activeCategory, q, orden: sort.id })}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.12em] ${orden === sort.id ? "bg-black text-white" : "text-black/60"}`}
            >
              {sort.label}
            </Link>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-10 text-lg">
            Ningún ebook coincide. <Link href="/catalogo" className="font-semibold">Ver todo</Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} layout="tile" />
            ))}
          </div>
        )}
        <StoreFooter />
      </main>
    </CheckoutProvider>
  );
}
