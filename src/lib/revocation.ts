import { randomBytes } from "node:crypto";
import { z } from "zod";
import { site } from "@/content/site";

/** Botón de arrepentimiento: pedido sin cuenta, con código de seguimiento por mail. */

const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  orderRef: z.string().trim().max(80).optional().default(""),
  reason: z.string().trim().max(1000).optional().default(""),
  company: z.string().optional(),
});

export type RevocationInput = { email: string; orderRef: string | null; reason: string | null; honeypot: boolean };

export function parseRevocation(json: unknown): { ok: true; data: RevocationInput } | { ok: false; error: string } {
  const parsed = schema.safeParse(json);
  if (!parsed.success) return { ok: false, error: "Revisá el email de la compra." };
  return {
    ok: true,
    data: {
      email: parsed.data.email,
      orderRef: parsed.data.orderRef || null,
      reason: parsed.data.reason || null,
      honeypot: Boolean(parsed.data.company?.trim()),
    },
  };
}

/** Código corto y legible, sin letras que se confunden (0/O, 1/I). */
export function revocationCode(bytes: Uint8Array = randomBytes(6)): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `ARR-${chars}`;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function revocationBuyerEmail(code: string): { subject: string; html: string; text: string } {
  const subject = `Recibimos tu pedido de arrepentimiento (${code})`;
  const body = `Recibimos tu pedido de arrepentimiento. Tu código de seguimiento es ${code}. Lo revisamos y te respondemos a este mail. Guardá el código por si necesitás consultarnos.`;
  return {
    subject,
    text: `${body}\n\n${site.brand.name}`,
    html: `<p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5">${escapeHtml(body)}</p><p style="font-family:Arial,sans-serif;font-size:14px;color:#55535c">${escapeHtml(site.brand.name)}</p>`,
  };
}

export function revocationSellerEmail(code: string, input: RevocationInput): { subject: string; html: string; text: string } {
  const lines = [
    `Código: ${code}`,
    `Email: ${input.email}`,
    `Operación: ${input.orderRef ?? "(no la indicó)"}`,
    `Motivo: ${input.reason ?? "(no lo indicó)"}`,
  ];
  return {
    subject: `Arrepentimiento ${code} · ${input.email}`,
    text: lines.join("\n"),
    html: `<pre style="font-family:Menlo,monospace;font-size:14px">${escapeHtml(lines.join("\n"))}</pre>`,
  };
}
