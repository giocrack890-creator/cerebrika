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
    <section id={id} className="scroll-mt-28 py-6">
      <div className="rounded-[32px] bg-[#EA580C] px-6 py-12 text-white sm:px-12">
        <p className="text-[11px] font-semibold tracking-[0.18em]">{kicker.toUpperCase()}</p>
        <h2 className="mt-3 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] font-bold tracking-[-0.05em]">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">{body}</p>
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
              className="w-full rounded-full bg-white px-5 py-3 text-base text-[#111111] outline-none"
            />
            <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
              <label>
                Empresa
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="shrink-0 rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white disabled:opacity-60"
            >
              {pending ? site.lead.submitting : button}
            </button>
          </form>
        )}
        {error ? (
          <p role="alert" className="mt-4 text-sm text-white">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
