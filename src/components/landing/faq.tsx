"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="preguntas" className="scroll-mt-28 mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em]">{site.faqHeading}</h2>
      <div className="mt-8 space-y-3">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div key={item.q} className="rounded-[24px] bg-white">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold tracking-[-0.03em]"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {item.q}
                  <span aria-hidden="true" className="text-black/40">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <p id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-6 leading-relaxed text-black/70">
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
