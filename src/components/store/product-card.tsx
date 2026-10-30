import Link from "next/link";
import { BookCover } from "@/components/store/book-cover";
import { categoryLabel, resolvePriceArs, type Product } from "@/content/products";
import { formatArs } from "@/lib/format";

export function productColor(product: Product): string {
  return product.cover.color;
}

export function ProductCard({ product, layout = "poster" }: { product: Product; layout?: "poster" | "tile" }) {
  const price = resolvePriceArs(product);
  const priceLabel = price ? formatArs(price) : "A confirmar";
  const mark = product.status === "coming_soon" ? "PRÓXIMAMENTE" : product.badge.toUpperCase();
  const priceLine = product.status === "coming_soon" ? `Precio previsto · ${priceLabel}` : `Pago único · ${priceLabel}`;

  if (layout === "tile") {
    return (
      <Link
        href={`/productos/${product.slug}`}
        className="flex h-full flex-col justify-between rounded-[28px] p-5 text-white"
        style={{ backgroundColor: product.cover.color }}
      >
        <div className="w-36">
          <BookCover product={product} compact />
        </div>
        <div className="mt-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/75">
            {categoryLabel(product.category).toUpperCase()} · {mark}
          </p>
          <h2 className="mt-2 text-[1.7rem] leading-[0.95] font-bold tracking-[-0.045em]">{product.title}</h2>
          <p className="mt-2 text-sm leading-snug text-white/80">{product.promise}</p>
          <p className="mt-4 text-sm font-semibold">{priceLine}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="relative mb-4 grid min-h-[72svh] items-center gap-6 overflow-hidden rounded-[32px] px-6 pt-16 pb-28 text-white sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:pb-20"
      style={{ backgroundColor: product.cover.color }}
    >
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/80">
          {categoryLabel(product.category).toUpperCase()} · {mark}
        </p>
        <h2 className="mt-4 max-w-xl text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.92] font-bold tracking-[-0.05em]">
          {product.promise}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 lg:text-lg">{product.description}</p>
        <p className="mt-6 text-sm font-semibold tracking-tight">{priceLine}</p>
        <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-black">
          VER EBOOK
        </span>
      </div>
      <div className="mx-auto w-[min(100%,240px)]">
        <BookCover product={product} />
      </div>
    </Link>
  );
}
