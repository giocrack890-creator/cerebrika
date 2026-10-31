"use client";

import { useState } from "react";
import { TextPage } from "@/components/landing/text-page";
import { CheckIcon } from "@/components/ui/icons";

export default function RevocationPage() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/arrepentimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          orderRef: String(form.get("orderRef") ?? ""),
          reason: String(form.get("reason") ?? ""),
          company: String(form.get("company") ?? ""),
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string; error?: string; code?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "No pudimos registrar el pedido.");
        setPending(false);
        return;
      }
      setMessage(data?.code ? `${data.message} Código: ${data.code}.` : (data?.message ?? "Listo."));
      setPending(false);
    } catch {
      setError("No pudimos registrar el pedido.");
      setPending(false);
    }
  }

  return (
    <TextPage kicker="Botón de arrepentimiento" title="Arrepentirte de una compra">
      <p>
        Completá el email con el que compraste y, si lo tenés, el número de operación de Mercado Pago. No hace falta cuenta ni
        contraseña. Te mandamos un código de seguimiento por mail y revisamos el pedido.
      </p>
      {message ? (
        <p role="status" className="flex gap-2 font-sans text-[16px] text-ink">
          <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-accent" />
          {message}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="relative mt-2 space-y-4 rounded-[16px] bg-surface p-5 font-sans shadow-[inset_0_0_0_1px_var(--line)]">
          <div>
            <label htmlFor="arr-email" className="text-[14px] font-semibold text-ink">
              Email de la compra
            </label>
            <input id="arr-email" name="email" type="email" inputMode="email" required autoComplete="email" className="field mt-2" />
          </div>
          <div>
            <label htmlFor="arr-order" className="text-[14px] font-semibold text-ink">
              Número de operación <span className="font-normal text-subtle">(opcional)</span>
            </label>
            <input id="arr-order" name="orderRef" maxLength={80} className="field mt-2" />
          </div>
          <div>
            <label htmlFor="arr-reason" className="text-[14px] font-semibold text-ink">
              Motivo <span className="font-normal text-subtle">(opcional)</span>
            </label>
            <textarea id="arr-reason" name="reason" maxLength={1000} rows={4} className="field mt-2 h-auto py-3" />
          </div>
          <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
            <input name="company" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={pending} className="btn btn-ink w-full">
            {pending ? "Enviando…" : "Enviar pedido"}
          </button>
          {error ? (
            <p role="alert" className="text-[14px] text-danger">
              {error}
            </p>
          ) : null}
        </form>
      )}
    </TextPage>
  );
}
