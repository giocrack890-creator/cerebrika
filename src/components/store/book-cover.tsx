import type { Product } from "@/content/products";

export function BookCover({
  product,
  className = "",
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  const { color, layout, headline, line, kicker } = product.cover;
  const frame = layout === "frame";
  const band = layout === "band";
  const split = layout === "split";

  return (
    <div
      className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-[14px] p-4 text-white ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {frame ? <div className="pointer-events-none absolute inset-3 rounded-[8px] border border-white/50" /> : null}
      {band ? <div className="absolute inset-x-0 top-0 h-2 bg-white" /> : null}
      {split ? <div className="absolute inset-y-0 left-0 w-3 bg-white" /> : null}
      {layout === "stack" ? (
        <>
          <div className="absolute right-3 bottom-3 left-3 h-8 rounded-md bg-white/15" />
          <div className="absolute right-5 bottom-6 left-5 h-8 rounded-md bg-white/25" />
        </>
      ) : null}
      <p className={`relative text-[10px] font-semibold tracking-[0.18em] ${split ? "pl-2" : ""}`}>{kicker.toUpperCase()}</p>
      <p className={`relative mt-auto leading-[0.95] font-bold tracking-[-0.04em] ${compact ? "text-sm" : "text-[1.35rem]"} ${split ? "pl-2" : ""}`}>
        {headline}
      </p>
      <p className={`relative mt-2 leading-snug text-white/80 ${compact ? "text-[10px]" : "text-xs"} ${split ? "pl-2" : ""}`}>{line}</p>
    </div>
  );
}
