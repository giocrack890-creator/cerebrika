"use client";

import { useState } from "react";
import { Container } from "@/components/landing/sections";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";
import { CheckIcon } from "@/components/ui/icons";

export default function AccountPage() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "No pudimos reenviar los enlaces.");
        setPending(false);
        return;
      }
      setMessage(data?.message ?? "Listo. Revisá el mail.");
      setPending(false);
    } catch {
      setError("No pudimos reenviar los enlaces.");
      setPending(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="pb-12 sm:pb-24">
        <Container className="pt-8 sm:pt-14">
          <div className="max-w-lg">
            <p className="text-[13px] font-medium text-accent">Mis compras</p>
            <h1 className="font-display mt-2 text-[clamp(2.4rem,9vw,3.5rem)] leading-[0.98] font-bold tracking-[-0.045em]">
              Volvé a bajar tus ebooks
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              No hace falta contraseña. Escribí el mail con el que pagaste y te reenviamos los enlaces de descarga, renovados.
            </p>
            <form onSubmit={onSubmit} className="relative mt-8 rounded-[24px] bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-6">
              <label className="text-[14px] font-medium" htmlFor="cuenta-email">
                Email de la compra
              </label>
              <input
                id="cuenta-email"
                name="email"
                type="email"
                inputMode="email"
                required
                autoComplete="email"
                placeholder="tu@escuela.edu.ar"
                className="field mt-2"
              />
              <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
                <input name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" disabled={pending} className="btn btn-ink mt-4 w-full">
                {pending ? "Enviando…" : "Reenviar enlaces"}
              </button>
              {message ? (
                <p role="status" className="mt-4 flex gap-2 text-[14px] leading-relaxed">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {message}
                </p>
              ) : null}
              {error ? (
                <p role="alert" className="mt-4 text-[14px] text-danger">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </Container>
      </main>
      <StoreFooter />
    </>
  );
}
