"use client";

import { useState } from "react";
import { BookCover, toneBackdrop } from "@/components/store/book-cover";
import { ShareIcon } from "@/components/ui/icons";
import type { Product } from "@/content/products";

/** Tapa y vistas del índice. Las páginas son recortes del índice, no el PDF. */
export function ProductGallery({ product }: { product: Product }) {
  const pages = product.chapters.slice(0, 3);
  const [index, setIndex] = useState(0);
  const page = index > 0 ? pages[index - 1] : null;

  return (
    <div>
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] sm:aspect-[5/4]"
        style={{ backgroundColor: toneBackdrop[product.cover.tone] }}
      >
        {page ? (
          <article key={page.number} className="rise-in w-[72%] max-w-sm rounded-[12px] bg-surface p-6 shadow-[0_24px_48px_-24px_rgba(21,20,26,0.35)] sm:p-8">
            <p className="text-[13px] font-medium text-accent">Capítulo {page.number}</p>
            <h3 className="font-display mt-3 text-[clamp(1.25rem,4vw,1.6rem)] leading-[1.05] font-bold tracking-[-0.03em]">{page.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{page.summary}</p>
            <div className="mt-6 space-y-2" aria-hidden="true">
              <span className="block h-1.5 w-full rounded-full bg-line" />
              <span className="block h-1.5 w-11/12 rounded-full bg-line" />
              <span className="block h-1.5 w-4/5 rounded-full bg-line" />
            </div>
            <p className="mt-6 text-[12px] text-subtle">Vista del índice · no es el texto del libro</p>
          </article>
        ) : (
          <div key="tapa" className="rise-in w-[48%] max-w-[260px]">
            <BookCover product={product} tilted />
          </div>
        )}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Vistas">
        <button
          type="button"
          role="tab"
          aria-selected={index === 0}
          aria-label="Tapa"
          onClick={() => setIndex(0)}
          className={`w-14 shrink-0 rounded-[8px] p-1 transition-shadow ${index === 0 ? "shadow-[inset_0_0_0_2px_var(--accent)]" : "shadow-[inset_0_0_0_1px_var(--line)]"}`}
        >
          <BookCover product={product} compact />
        </button>
        {pages.map((chapter, pageIndex) => {
          const selected = index === pageIndex + 1;
          return (
            <button
              key={chapter.number}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Capítulo ${chapter.number}: ${chapter.title}`}
              onClick={() => setIndex(pageIndex + 1)}
              className={`flex w-14 shrink-0 flex-col justify-between rounded-[8px] bg-surface p-2 text-left transition-shadow ${
                selected ? "shadow-[inset_0_0_0_2px_var(--accent)]" : "shadow-[inset_0_0_0_1px_var(--line)]"
              }`}
            >
              <span className="text-[11px] font-semibold text-accent">{chapter.number}</span>
              <span className="mt-3 space-y-1" aria-hidden="true">
                <span className="block h-1 w-full rounded-full bg-line" />
                <span className="block h-1 w-2/3 rounded-full bg-line" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? "Link copiado" : "Compartir"}
    </button>
  );
}
