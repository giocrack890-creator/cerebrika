"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function LeadForm() {
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
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? site.lead.genericError);
        setPending(false);
        return;
      }
      setSuccess(data?.message ?? site.lead.success);
      setPending(false);
      event.currentTarget.reset();
    } catch {
      setError(site.lead.genericError);
      setPending(false);
    }
  }

  return (
    <section id="prompts" className="scroll-mt-28 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white px-6 py-12 shadow-[0_20px_50px_rgba(17,17,17,0.06)] sm:px-12">
        <p className="text-xs font-semibold tracking-[0.18em]">{site.lead.kicker}</p>
        <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
          {site.lead.title}
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-black/70">{site.lead.body}</p>
        {success ? (
          <p role="status" className="mt-8 text-base font-medium">
            {success}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="relative mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="lead-email">
              {site.lead.emailLabel}
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={site.lead.emailPlaceholder}
              className="w-full rounded-full border border-black/10 bg-[#F5F2EB] px-5 py-3 text-base outline-none"
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
              {pending ? site.lead.submitting : site.lead.button}
            </button>
          </form>
        )}
        {error ? (
          <p role="alert" className="mt-4 text-sm text-[#DC2626]">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
