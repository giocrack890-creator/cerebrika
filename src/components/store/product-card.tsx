import Link from "next/link";
import { categoryLabel, resolvePriceArs, type Product } from "@/content/products";
import { formatArs } from "@/lib/format";
import { CoverFace } from "@/components/store/cover";

export function ProductCard({ product }: { product: Product }) {
  const price = resolvePriceArs(product);
  const priceLabel = price ? formatArs(price) : "Precio a confirmar";
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex h-full flex-col rounded-[24px] border border-black/10 bg-[#FBF8F3] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,23,20,0.08)]"
    >
      <CoverFace product={product} />
      <p className="mt-4 text-[11px] font-semibold tracking-[0.16em] text-[#6B4F3B] uppercase">
        {categoryLabel(product.category)} · {product.status === "coming_soon" ? "Próximamente" : product.badge}
      </p>
      <h3 className="font-display mt-2 text-[1.45rem] leading-[1.05] tracking-[-0.03em] group-hover:underline group-hover:decoration-[#C4A27A] group-hover:underline-offset-4">
        {product.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5E564E]">{product.promise}</p>
      <p className="mt-4 text-sm font-semibold">
        {product.status === "coming_soon" ? "Precio previsto · " : ""}
        {priceLabel}
      </p>
    </Link>
  );
}
