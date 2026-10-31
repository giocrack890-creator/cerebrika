import type { CoverTone, Product } from "@/content/products";

type ToneStyle = { bg: string; fg: string; soft: string; mark: string; ring: string };

export const coverTones: Record<CoverTone, ToneStyle> = {
  violet: { bg: "#4b33c9", fg: "#ffffff", soft: "rgba(255,255,255,0.72)", mark: "#d6cff6", ring: "rgba(255,255,255,0.35)" },
  deep: { bg: "#2a1d7a", fg: "#ffffff", soft: "rgba(255,255,255,0.7)", mark: "#b9aef5", ring: "rgba(255,255,255,0.3)" },
  ink: { bg: "#15141a", fg: "#f7f6f2", soft: "rgba(247,246,242,0.66)", mark: "#b9aef5", ring: "rgba(247,246,242,0.25)" },
  lavender: { bg: "#e9e5fb", fg: "#2a1d7a", soft: "rgba(42,29,122,0.7)", mark: "#4b33c9", ring: "rgba(42,29,122,0.25)" },
  paper: { bg: "#ffffff", fg: "#15141a", soft: "#5c5a66", mark: "#4b33c9", ring: "#e4e2da" },
};

/** Fondo suave para el bloque que rodea una tapa. */
export const toneBackdrop: Record<CoverTone, string> = {
  violet: "#e9e5fb",
  deep: "#e9e5fb",
  ink: "#ecebe6",
  lavender: "#f1eefc",
  paper: "#ecebe6",
};

export function BookCover({
  product,
  className = "",
  compact = false,
  tilted = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
  tilted?: boolean;
}) {
  const { tone, layout, headline, line } = product.cover;
  const style = coverTones[tone];

  return (
    <div
      className={`relative flex aspect-[3/4] flex-col overflow-hidden p-[9%] [container-type:inline-size] ${compact ? "rounded-[6px]" : "rounded-[10px]"} ${tilted ? "book" : ""} ${className}`}
      style={{ backgroundColor: style.bg, color: style.fg, boxShadow: tone === "paper" && !tilted ? `inset 0 0 0 1px ${style.ring}` : undefined }}
      aria-hidden="true"
    >
      {layout === "frame" ? (
        <div className="pointer-events-none absolute inset-[5%] rounded-[4px] border" style={{ borderColor: style.ring }} />
      ) : null}
      {layout === "band" ? <div className="absolute inset-x-0 top-0 h-[5%]" style={{ backgroundColor: style.mark }} /> : null}
      {layout === "split" ? <div className="absolute inset-y-0 right-0 w-[16%]" style={{ backgroundColor: style.mark, opacity: 0.9 }} /> : null}
      {layout === "stack" ? (
        <div className="absolute top-[24%] right-[9%] left-[9%] flex flex-col gap-[3cqw]" style={{ opacity: 0.5 }}>
          <span className="h-[2cqw] w-full rounded-full" style={{ backgroundColor: style.mark }} />
          <span className="h-[2cqw] w-3/4 rounded-full" style={{ backgroundColor: style.mark }} />
          <span className="h-[2cqw] w-1/2 rounded-full" style={{ backgroundColor: style.mark }} />
        </div>
      ) : null}
      <p
        className="font-display relative text-[clamp(6px,8cqw,15px)] font-bold tracking-[-0.02em]"
        style={{ color: style.soft }}
      >
        cerebrika
      </p>
      <p
        className={`font-display relative mt-auto text-[17cqw] leading-[0.95] font-bold tracking-[-0.035em] [overflow-wrap:break-word] ${layout === "split" ? "pr-[22%]" : ""}`}
      >
        {headline}
      </p>
      {compact ? null : (
        <p className={`relative mt-[4cqw] text-[7.5cqw] leading-snug ${layout === "split" ? "pr-[22%]" : ""}`} style={{ color: style.soft }}>
          {line}
        </p>
      )}
    </div>
  );
}
