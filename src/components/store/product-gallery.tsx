"use client";

import { useState } from "react";
import { BookCover } from "@/components/store/book-cover";
import type { Product } from "@/content/products";

export function ProductGallery({ product }: { product: Product }) {
  const pages = product.chapters.slice(0, 4);
  const [index, setIndex] = useState(0);
  const total = pages.length + 1;
  const safe = Math.min(index, total - 1);

  return (
    <div>
      <div className="overflow-hidden rounded-[28px] p-6 sm:p-10" style={{ backgroundColor: product.cover.color }}>
        {safe === 0 ? (
          <div className="mx-auto w-[min(100%,280px)]">
            <BookCover product={product} />
          </div>
        ) : (
          <article className="mx-auto min-h-[360px] max-w-md rounded-[24px] bg-white p-6 text-[#111111] sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-black/45">PÁGINA · {pages[safe - 1]?.number}</p>
            <h3 className="mt-4 text-2xl leading-[0.95] font-bold tracking-[-0.045em]">{pages[safe - 1]?.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-black/70">{pages[safe - 1]?.summary}</p>
            <p className="mt-8 text-xs tracking-[0.14em] text-black/40">VISTA PREVIA · NO ES EL PDF</p>
          </article>
        )}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setIndex(0)}
          aria-label="Tapa"
          aria-current={safe === 0}
          className={`w-16 shrink-0 overflow-hidden rounded-xl ${safe === 0 ? "ring-2 ring-black ring-offset-2 ring-offset-[#F5F2EB]" : ""}`}
        >
          <BookCover product={product} />
        </button>
        {pages.map((chapter, pageIndex) => {
          const selected = safe === pageIndex + 1;
          return (
            <button
              key={chapter.number}
              type="button"
              onClick={() => setIndex(pageIndex + 1)}
              aria-label={`Ver adentro: ${chapter.title}`}
              aria-current={selected}
              className={`flex h-20 w-16 shrink-0 flex-col justify-end rounded-xl bg-white p-2 text-left ${selected ? "ring-2 ring-black ring-offset-2 ring-offset-[#F5F2EB]" : ""}`}
            >
              <span className="text-[10px] font-bold tracking-[0.12em]">{chapter.number}</span>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={() => setIndex(1)} className="mt-3 text-[11px] font-semibold tracking-[0.14em]">
        VER ADENTRO →
      </button>
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
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={onShare} className="text-[11px] font-semibold tracking-[0.14em]">
      {copied ? "LINK COPIADO" : "COMPARTIR"}
    </button>
  );
}
