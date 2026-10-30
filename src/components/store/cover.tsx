import type { Product } from "@/content/products";

export function CoverFace({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-[12px] bg-[#1A1612] p-4 text-[#F6F1E8] shadow-[0_16px_40px_rgba(28,23,20,0.18)] ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-2 rounded-[8px] border border-[#C4A27A]/55" />
      <p className="relative text-[10px] font-medium tracking-[0.22em] text-[#C4A27A] uppercase">{product.cover.kicker}</p>
      <p className="font-display relative mt-8 text-[1.45rem] leading-[0.95] tracking-[-0.03em]">{product.cover.headline}</p>
      <p className="relative mt-3 max-w-[12rem] text-xs leading-snug text-[#F6F1E8]/75">{product.cover.line}</p>
    </div>
  );
}

export function CoverScene({ product }: { product: Product }) {
  return (
    <div className="book-scene" aria-hidden="true">
      <div className="book-rig">
        <div className="book-shadow" />
        <div className="book-pages" />
        <div className="book-spine" />
        <div className="book-cover">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A27A] uppercase">{product.cover.kicker}</p>
          <p className="font-display mt-10 text-[2.15rem] leading-[0.92] tracking-[-0.04em]">{product.cover.headline}</p>
          <p className="mt-5 max-w-[12rem] text-sm leading-snug text-[#F6F1E8]/80">{product.cover.line}</p>
          <p className="mt-auto text-[11px] tracking-[0.18em] text-[#C4A27A] uppercase">
            {product.status === "available" ? "Ebook · PDF" : "Próximamente"}
          </p>
        </div>
      </div>
    </div>
  );
}
