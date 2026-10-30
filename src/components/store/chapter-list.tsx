"use client";

import { useState } from "react";
import type { Chapter } from "@/content/products";

export function ChapterList({ chapters }: { chapters: readonly Chapter[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-6">
      {chapters.map((chapter) => {
        const isOpen = open === chapter.number;
        return (
          <div key={chapter.number} className="border-t border-black/10">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : chapter.number)}
              >
                <span className="text-lg font-semibold tracking-[-0.03em]">
                  <span className="mr-3 text-xs tracking-[0.14em] text-black/45">{chapter.number}</span>
                  {chapter.title}
                </span>
                <span aria-hidden="true" className="text-black/40">
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            {isOpen ? <p className="pb-4 pl-9 text-sm leading-relaxed text-black/70">{chapter.summary}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
