"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";
import type { Prompt } from "@/content/prompts";
import { site } from "@/content/site";

/** Resalta los corchetes: es lo que la persona tiene que completar. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("[") ? (
          <mark key={index} className="rounded-[4px] bg-accent-soft px-1 text-accent-ink">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="reveal flex flex-col rounded-[16px] bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line)]">
      <figcaption className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-medium">{prompt.title.replace(/^\d+\.\s*/, "")}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-accent" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? site.preview.copied : site.preview.copy}
        </button>
      </figcaption>
      <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/90">
        <Highlighted text={prompt.body} />
      </blockquote>
    </figure>
  );
}
