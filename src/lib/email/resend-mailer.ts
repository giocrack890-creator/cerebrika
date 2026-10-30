import { Resend } from "resend";
import type { Mailer } from "@/lib/delivery/types";
import { requireEnv } from "@/lib/env";

export function createResendMailer(): Mailer {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const from = requireEnv("EMAIL_FROM");

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
