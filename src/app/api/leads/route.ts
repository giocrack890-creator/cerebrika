import { parseLeadSource } from "@/content/products";
import { prompts } from "@/content/prompts";
import { site } from "@/content/site";
import { promptsEmail } from "@/lib/email/templates";
import { createResendMailer } from "@/lib/email/resend-mailer";
import { jsonError, jsonOk, parseContactForm } from "@/lib/forms";
import { saveLead } from "@/lib/supabase/leads";

export async function POST(request: Request) {
  const form = await parseContactForm(request);
  if (!form.ok) return jsonError(form.error, 400);

  const source = parseLeadSource(form.source);
  if (!source) return jsonError("No encontramos ese aviso.", 400);
  if (form.honeypot) {
    return jsonOk({
      message: source === "prompts-planificacion" ? site.lead.success : site.lead.waitlistSuccess,
    });
  }

  try {
    await saveLead(form.email, source);
    if (source === "prompts-planificacion") {
      const message = promptsEmail(prompts);
      await createResendMailer().send({ to: form.email, ...message });
      return jsonOk({ message: site.lead.success });
    }
    return jsonOk({ message: site.lead.waitlistSuccess });
  } catch (error) {
    console.error("lead_failed", error instanceof Error ? error.message : "unknown");
    const missing = error instanceof Error && error.message.startsWith("Falta la variable");
    return jsonError(
      missing ? "El envío del material gratis no está configurado todavía." : site.lead.genericError,
      missing ? 503 : 502,
    );
  }
}
