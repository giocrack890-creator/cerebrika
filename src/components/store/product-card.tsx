import Link from "next/link";
import { categoryLabel, products, resolvePriceArs, type Product } from "@/content/products";
import { formatArs } from "@/lib/format";

const blockColors = ["#3730A3", "#EA580C", "#DC2626", "#6B4F3B"] as const;

export function productColor(slug: string): string {
  const index = Math.max(0, products.findIndex((item) => item.slug === slug));
  return blockColors[index % blockColors.length] ?? blockColors[0];
}

function CoverSheet({ product }: { product: Product }) {
  return (
    <div className="pointer-events-none relative min-h-[220px]" aria-hidden="true">
      <div className="absolute top-6 right-0 h-[82%] w-[88%] rotate-[8deg] rounded-[28px] bg-white/25" />
      <div className="absolute top-14 right-6 flex h-[78%] w-[84%] -rotate-[4deg] flex-col rounded-[28px] bg-white p-6 text-[#111111] shadow-2xl">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-black/40">EBOOK</p>
        <p className="mt-4 text-2xl leading-none font-bold tracking-[-0.04em]">{product.cover.headline}</p>
        <p className="mt-3 text-sm leading-snug text-black/70">{product.cover.line}</p>
        <div className="mt-6 space-y-3">
          <div className="h-2 rounded-full bg-black/10" />
          <div className="h-2 w-5/6 rounded-full bg-black/10" />
          <div className="h-2 w-2/3 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, sticky = true }: { product: Product; sticky?: boolean }) {
  const price = resolvePriceArs(product);
  const priceLabel = price ? formatArs(price) : "A confirmar";
  const index = Math.max(0, products.findIndex((item) => item.slug === product.slug));
  const mark = product.status === "coming_soon" ? "PRÓXIMAMENTE" : product.badge.toUpperCase();

  return (
    <Link
      href={`/productos/${product.slug}`}
      className={`relative mb-4 grid items-center gap-6 overflow-hidden rounded-[32px] px-6 pt-16 pb-28 text-white sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:pt-14 lg:pb-20 ${
        sticky ? "sticky top-[6vh] min-h-[78svh] lg:min-h-[72vh]" : "min-h-[420px]"
      }`}
      style={{ backgroundColor: productColor(product.slug), zIndex: index + 1 }}
    >
      <p className="absolute top-6 right-6 text-sm font-medium tracking-[0.18em] text-white/80">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/80">
          {categoryLabel(product.category).toUpperCase()} · {mark}
        </p>
        <h2 className="mt-4 max-w-xl text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.92] font-bold tracking-[-0.05em]">
          {product.promise}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 lg:text-lg">{product.description}</p>
        <p className="mt-6 text-sm font-semibold tracking-tight">
          {product.status === "coming_soon" ? `Precio previsto · ${priceLabel}` : `Pago único · ${priceLabel}`}
        </p>
        <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          VER EBOOK
        </span>
      </div>
      <CoverSheet product={product} />
    </Link>
  );
}
