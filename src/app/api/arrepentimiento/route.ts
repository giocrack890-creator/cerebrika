import { createMailer } from "@/lib/email/mailer";
import { jsonError, jsonOk } from "@/lib/forms";
import {
  parseRevocation,
  revocationBuyerEmail,
  revocationCode,
  revocationSellerEmail,
} from "@/lib/revocation";
import { getServiceClient } from "@/lib/supabase/admin";

const done = "Listo. Te mandamos un mail con el código de seguimiento.";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError("Revisá el email de la compra.", 400);
  }
  const parsed = parseRevocation(json);
  if (!parsed.ok) return jsonError(parsed.error, 400);
  const input = parsed.data;
  if (input.honeypot) return jsonOk({ message: done });

  try {
    const code = revocationCode();
    const { error } = await getServiceClient().from("revocation_requests").insert({
      code,
      email: input.email,
      order_ref: input.orderRef,
      reason: input.reason,
    });
    if (error) throw error;

    const mailer = createMailer();
    await mailer.send({ to: input.email, ...revocationBuyerEmail(code) });
    const support = process.env.SUPPORT_EMAIL?.trim();
    if (support) {
      await mailer.send({ to: support, ...revocationSellerEmail(code, input) });
    } else {
      console.error("revocation_missing_support_email", code);
    }
    return jsonOk({ message: done, code });
  } catch (error) {
    console.error("revocation_failed", error instanceof Error ? error.message : "unknown");
    const missing = error instanceof Error && error.message.startsWith("Falta la variable");
    return jsonError(
      missing ? "El formulario no está configurado todavía. Escribinos al mail de la compra." : "No pudimos registrar el pedido. Intentá de nuevo en un rato.",
      missing ? 503 : 502,
    );
  }
}
