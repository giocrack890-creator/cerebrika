"use client";

import { useState } from "react";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import Link from "next/link";

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
      <StoreChrome
        bar="Mis compras"
        showBar={false}
        corner={
          <Link href="/catalogo" className="rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white">
            CATÁLOGO
          </Link>
        }
        barAction={null}
      />
      <main id="inicio" className="mx-auto max-w-xl px-6 pt-10 pb-24">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">Mi cuenta</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.055em]">Mis compras</h1>
        <p className="mt-4 text-lg leading-relaxed text-black/70">
          No hay contraseña. Si ya pagaste, te reenviamos los enlaces de descarga a ese mail.
        </p>
        <form onSubmit={onSubmit} className="relative mt-8 rounded-[28px] bg-white p-6">
          <label className="text-sm font-medium" htmlFor="cuenta-email">
            Email de la compra
          </label>
          <input id="cuenta-email" name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-full bg-[#F5F2EB] px-5 py-3 outline-none" />
          <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
            <input name="company" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={pending} className="mt-5 rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white disabled:opacity-60">
            {pending ? "Enviando…" : "REENVIAR ENLACES"}
          </button>
          {message ? <p role="status" className="mt-4 text-sm">{message}</p> : null}
          {error ? <p role="alert" className="mt-4 text-sm text-[#DC2626]">{error}</p> : null}
        </form>
      </main>
      <StoreFooter />
    </>
  );
}
