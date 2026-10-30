import { getPriceArs } from "@/lib/env";
import { jsonError, jsonOk, parseContactForm } from "@/lib/forms";
import { createCheckoutPreference } from "@/lib/payments/mercadopago";

export async function POST(request: Request) {
  const form = await parseContactForm(request);
  if (!form.ok) return jsonError(form.error, 400);
  if (form.honeypot) return jsonError("No pudimos abrir el pago.", 400);

  if (!getPriceArs()) {
    return jsonError("El precio no está configurado.", 503);
  }

  try {
    const initPoint = await createCheckoutPreference(form.email);
    return jsonOk({ initPoint });
  } catch (error) {
    console.error("checkout_failed", error instanceof Error ? error.message : "unknown");
    const missing = error instanceof Error && error.message.startsWith("Falta la variable");
    return jsonError(
      missing
        ? "Los pagos no están configurados todavía."
        : "Mercado Pago no pudo iniciar el cobro. Intentá de nuevo.",
      missing ? 503 : 502,
    );
  }
}
