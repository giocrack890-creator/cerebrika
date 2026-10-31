"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

export function FaqList({
  items,
  id = "preguntas",
  title = site.faqHeading,
  kicker = site.faqKicker,
}: {
  items: readonly { q: string; a: string }[];
  id?: string;
  title?: string;
  kicker?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-[13px] font-medium text-accent">{kicker}</p>
        <h2 className="font-display mt-2 text-[clamp(1.9rem,6vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">{title}</h2>
        <div className="mt-8 border-t border-line">
          {items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${id}-panel-${index}`;
            const buttonId = `${id}-button-${index}`;
            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium sm:text-[17px]"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    {item.q}
                    <PlusIcon
                      className={`h-5 w-5 shrink-0 text-subtle transition-transform duration-300 ${isOpen ? "rotate-45 text-accent" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
