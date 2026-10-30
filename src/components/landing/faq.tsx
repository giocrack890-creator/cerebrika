"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="scroll-mt-8 mx-auto max-w-[760px] px-5 py-16 sm:px-6">
      <p className="text-[12px] font-semibold tracking-[0.22em] text-[#6B4F3B] uppercase">{site.faqKicker}</p>
      <h2 className="font-display mt-3 text-[clamp(2.2rem,4.4vw,3.5rem)] tracking-[-0.03em]">{site.faqHeading}</h2>
      <div className="mt-8 border-t border-black/10">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div key={item.q} className="border-b border-black/10">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold tracking-[-0.02em]"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {item.q}
                  <span aria-hidden="true" className="font-display text-2xl leading-none text-[#8E3F2A]">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <p id={panelId} role="region" aria-labelledby={buttonId} className="max-w-xl pb-5 leading-relaxed text-[#5E564E]">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
