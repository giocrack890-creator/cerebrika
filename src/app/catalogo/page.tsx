import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Container } from "@/components/landing/sections";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import { SearchIcon } from "@/components/ui/icons";
import { catalogHref, categories, categoryLabel, filterProducts, isCategoryId, isSortId, type SortId } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Catálogo · ${site.brand.name}`,
  description: "Ebooks cortos para usar la IA en un trabajo concreto.",
};

const sorts: { id: SortId; label: string }[] = [
  { id: "destacados", label: "Destacados" },
  { id: "precio", label: "Precio" },
  { id: "titulo", label: "A–Z" },
  { id: "lectura", label: "Más cortos" },
];

type Query = { q?: string | string[]; categoria?: string | string[]; orden?: string | string[] };

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 80);
}

const chip = "shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors";

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
  const available = filtered.filter((product) => product.status === "available").length;

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="pb-12 sm:pb-24">
        <Container className="pt-8 sm:pt-14">
          <p className="text-[13px] font-medium text-accent">Catálogo</p>
          <h1 className="font-display mt-2 text-[clamp(2.4rem,9vw,4rem)] leading-[0.98] font-bold tracking-[-0.045em]">
            {activeCategory ? categoryLabel(activeCategory) : "Ebooks cortos de IA"}
          </h1>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted">
            {filtered.length} {filtered.length === 1 ? "ebook" : "ebooks"}
            {q ? ` para “${q}”` : ""}.{" "}
            {available > 0 ? `${available === 1 ? "Uno se puede comprar hoy" : `${available} se pueden comprar hoy`}; el resto está en camino.` : "Están en camino: en cada ficha podés pedir aviso."}
          </p>

          <form action="/catalogo" method="get" role="search" className="relative mt-6 max-w-md">
            {activeCategory ? <input type="hidden" name="categoria" value={activeCategory} /> : null}
            {orden !== "destacados" ? <input type="hidden" name="orden" value={orden} /> : null}
            <label className="sr-only" htmlFor="buscar-catalogo">
              Buscar ebooks
            </label>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-subtle" />
            <input id="buscar-catalogo" name="q" type="search" defaultValue={q} placeholder="Buscar un ebook" className="field pl-11" />
          </form>

          <nav aria-label="Categorías" className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <Link
              href={catalogHref({ q, orden })}
              aria-current={activeCategory ? undefined : "page"}
              className={`${chip} ${activeCategory ? "bg-surface text-muted shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink" : "bg-ink text-white"}`}
            >
              Todos
            </Link>
            {categories.map((category) => {
              const selected = activeCategory === category.id;
              return (
                <Link
                  key={category.id}
                  href={catalogHref({ categoria: category.id, q, orden })}
                  aria-current={selected ? "page" : undefined}
                  className={`${chip} ${selected ? "bg-ink text-white" : "bg-surface text-muted shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink"}`}
                >
                  {category.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]" aria-label="Ordenar">
            <span className="text-subtle">Ordenar:</span>
            {sorts.map((sort) => (
              <Link
                key={sort.id}
                href={catalogHref({ categoria: activeCategory, q, orden: sort.id })}
                aria-current={orden === sort.id ? "true" : undefined}
                className={orden === sort.id ? "font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px]" : "text-muted hover:text-ink"}
              >
                {sort.label}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12 rounded-[24px] bg-surface px-5 py-12 text-center shadow-[inset_0_0_0_1px_var(--line)]">
              <p className="font-display text-[22px] font-bold tracking-[-0.02em]">Ningún ebook coincide</p>
              <p className="mt-2 text-[15px] text-muted">Probá con otra palabra o mirá todo el catálogo.</p>
              <Link href="/catalogo" className="btn btn-ink mt-6">
                Ver todo
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <StoreFooter />
    </>
  );
}
