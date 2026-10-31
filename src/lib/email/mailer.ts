import nodemailer from "nodemailer";
import { site } from "@/content/site";
import type { Mailer } from "@/lib/delivery/types";
import { createResendMailer } from "@/lib/email/resend-mailer";

/**
 * Elige cómo salen los mails:
 * - Gmail (GMAIL_USER + GMAIL_APP_PASSWORD): no necesita dominio propio. Límite de Google: unos 500 por día.
 * - Resend (RESEND_API_KEY + EMAIL_FROM): para cuando haya un dominio verificado.
 * Si están las dos, gana Gmail.
 */
export function createMailer(): Mailer {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (gmailUser && gmailPassword) return createGmailMailer(gmailUser, gmailPassword);
  if (process.env.RESEND_API_KEY?.trim()) return createResendMailer();
  throw new Error("Falta la variable de entorno GMAIL_USER y GMAIL_APP_PASSWORD (o RESEND_API_KEY).");
}

function createGmailMailer(user: string, password: string): Mailer {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: password },
  });
  const from = `${site.brand.name} <${user}>`;

  return {
    async send(message) {
      await transport.sendMail({
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
    },
  };
}
