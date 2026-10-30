"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function LeadForm({
  id = "prompts",
  source = "prompts-planificacion",
  kicker = site.lead.kicker,
  title = site.lead.title,
  body = site.lead.body,
  button = site.lead.button,
  successMessage = site.lead.success,
}: {
  id?: string;
  source?: string;
  kicker?: string;
  title?: string;
  body?: string;
  button?: string;
  successMessage?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
          source,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? site.lead.genericError);
        setPending(false);
        return;
      }
      setSuccess(data?.message ?? successMessage);
      setPending(false);
      event.currentTarget.reset();
    } catch {
      setError(site.lead.genericError);
      setPending(false);
    }
  }

  return (
    <section id={id} className="scroll-mt-28 px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-[1080px] rounded-[28px] border border-black/10 bg-[#FBF8F3] px-6 py-10 sm:px-12 sm:py-12">
        <p className="text-[12px] font-semibold tracking-[0.22em] text-[#6B4F3B] uppercase">{kicker}</p>
        <h2 className="font-display mt-3 max-w-[18ch] text-[clamp(2rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.03em]">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5E564E]">{body}</p>
        {success ? (
          <p role="status" className="mt-8 text-base font-medium">
            {success}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="relative mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor={`${id}-email`}>
              {site.lead.emailLabel}
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={site.lead.emailPlaceholder}
              className="w-full rounded-full border border-black/15 bg-[#F3EEE6] px-5 py-3 text-base outline-none"
            />
            <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
              <label>
                Empresa
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button type="submit" disabled={pending} className="btn btn-secondary shrink-0 px-5 py-3 text-[15px] disabled:opacity-60">
              {pending ? site.lead.submitting : button}
            </button>
          </form>
        )}
        {error ? (
          <p role="alert" className="mt-4 text-sm text-[#8E3F2A]">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
