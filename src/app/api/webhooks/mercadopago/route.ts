import { resolvePaidProduct } from "@/content/products";
import { deliverWithLiveDeps } from "@/lib/delivery/live";
import { fetchMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { handleMercadoPagoWebhook } from "@/lib/payments/process-mercadopago-notification";

export async function POST(request: Request) {
  try {
    const result = await handleMercadoPagoWebhook(request, {
      webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim() ?? "",
      acceptProduct: (payment) => {
        const product = resolvePaidProduct(payment);
        if (!product) return null;
        return { productId: product.slug, productTitle: product.title };
      },
      getPayment: fetchMercadoPagoPayment,
      deliver: deliverWithLiveDeps,
    });
    return Response.json(result.body, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("webhook_mercadopago_failed", error instanceof Error ? error.message : "unknown");
    return Response.json(
      { ok: false, error: "retry" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
