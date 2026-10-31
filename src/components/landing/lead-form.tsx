"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
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
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
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
      formElement.reset();
    } catch {
      setError(site.lead.genericError);
      setPending(false);
    }
  }

  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-[24px] bg-accent-soft px-5 py-10 sm:px-10 sm:py-12">
        <p className="text-[13px] font-medium text-accent">{kicker}</p>
        <h2 className="font-display mt-2 max-w-xl text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-accent-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-accent-ink/80">{body}</p>
        {success ? (
          <p role="status" className="mt-6 flex max-w-lg items-start gap-3 text-[15px] font-medium text-accent-ink">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            {success}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="relative mt-6 flex max-w-lg flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor={`${id}-email`}>
              {site.lead.emailLabel}
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              placeholder={site.lead.emailPlaceholder}
              className="field shadow-[inset_0_0_0_1px_var(--accent-line)]"
            />
            <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
              <label>
                Empresa
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button type="submit" disabled={pending} className="btn btn-primary shrink-0">
              {pending ? site.lead.submitting : button}
            </button>
          </form>
        )}
        {error ? (
          <p role="alert" className="mt-3 text-[14px] text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
