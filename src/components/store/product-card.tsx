import Link from "next/link";
import { BookCover, toneBackdrop } from "@/components/store/book-cover";
import { categoryLabel, resolvePriceArs, type Product } from "@/content/products";
import { formatArs } from "@/lib/format";

/** Tarjeta de catálogo: tapa sobre un fondo del tono, título y precio. */
export function ProductCard({ product }: { product: Product }) {
  const price = resolvePriceArs(product);
  const comingSoon = product.status === "coming_soon";
  const href = `/productos/${product.slug}`;

  return (
    <article className="group reveal">
      <Link href={href} className="block">
        <div
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[16px] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1"
          style={{ backgroundColor: toneBackdrop[product.cover.tone] }}
        >
          <div className="w-[58%] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]">
            <BookCover product={product} tilted />
          </div>
          <span
            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[12px] font-medium ${
              comingSoon ? "bg-surface/90 text-muted" : "bg-accent text-white"
            }`}
          >
            {comingSoon ? "Próximamente" : "Disponible"}
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[13px] text-subtle">{categoryLabel(product.category)}</p>
            <p className={`shrink-0 text-[14px] font-semibold ${comingSoon ? "font-medium text-subtle" : ""}`}>
              {comingSoon ? "Pronto" : price ? formatArs(price) : "—"}
            </p>
          </div>
          <h3 className="mt-1 text-[15px] leading-snug font-medium transition-colors group-hover:text-accent sm:text-[16px]">{product.title}</h3>
        </div>
      </Link>
    </article>
  );
}
