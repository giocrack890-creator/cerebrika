import { quoteCart } from "@/lib/cart-math";
import { getProduct } from "@/content/products";
import { jsonError, jsonOk, parseContactForm } from "@/lib/forms";
import { createCheckoutPreference } from "@/lib/payments/mercadopago";

export async function POST(request: Request) {
  const form = await parseContactForm(request);
  if (!form.ok) return jsonError(form.error, 400);
  if (form.honeypot) return jsonError("No pudimos abrir el pago.", 400);

  const slugs = form.slugs?.length ? form.slugs : form.slug ? [form.slug] : [];
  const quote = quoteCart(slugs, form.coupon);
  if (!quote.ok) {
    const message =
      quote.error === "invalid_coupon"
        ? "Ese cupón no existe."
        : quote.error === "empty"
          ? "El carrito está vacío."
          : "Ese ebook no está a la venta.";
    return jsonError(message, 400);
  }

  const products = quote.lines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [product] : [];
  });

  try {
    const initPoint = await createCheckoutPreference(form.email, products, form.coupon);
    return jsonOk({ initPoint, total: quote.total });
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
