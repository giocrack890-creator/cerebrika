import { Resend } from "resend";
import { site } from "@/content/site";
import type { Mailer } from "@/lib/delivery/types";
import { requireEnv } from "@/lib/env";

/** El nombre visible del remitente es siempre la marca. El correo sale de EMAIL_FROM. */
export function brandFromAddress(raw: string): string {
  const trimmed = raw.trim();
  const angled = trimmed.match(/<([^>]+)>\s*$/);
  const email = (angled?.[1] ?? trimmed).trim();
  return `${site.brand.name} <${email}>`;
}

export function createResendMailer(): Mailer {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const from = brandFromAddress(requireEnv("EMAIL_FROM"));

  return {
    async send(message) {
      const { error } = await resend.emails.send({
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
  };
}
