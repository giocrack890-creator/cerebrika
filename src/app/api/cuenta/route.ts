import { getProduct } from "@/content/products";
import { deliveryEmail } from "@/lib/email/templates";
import { createMailer } from "@/lib/email/mailer";
import { getDownloadTtlHours, getSiteUrl } from "@/lib/env";
import { jsonError, jsonOk, parseContactForm } from "@/lib/forms";
import { createSupabaseOrderStore } from "@/lib/supabase/order-store";
import { site } from "@/content/site";

const message = "Si hay compras con ese mail, te reenviamos los enlaces. Revisá también spam.";

export async function POST(request: Request) {
  const form = await parseContactForm(request);
  if (!form.ok) return jsonError(form.error, 400);
  if (form.honeypot) return jsonOk({ message });

  try {
    const store = createSupabaseOrderStore();
    const expires = new Date(Date.now() + getDownloadTtlHours() * 60 * 60 * 1000).toISOString();
    await store.extendDownloads?.(form.email, expires);
    const downloads = (await store.listDownloadsByEmail?.(form.email)) ?? [];
    if (downloads.length > 0) {
      const siteUrl = getSiteUrl();
      const items = downloads.map((item) => ({
        title: getProduct(item.slug)?.title ?? item.title,
        downloadUrl: `${siteUrl}/descarga/${item.downloadToken}`,
      }));
      const mail = deliveryEmail({
        productTitle: items[0]?.title ?? site.brand.name,
        downloadUrl: items[0]?.downloadUrl ?? siteUrl,
        expiresAt: expires,
        items,
      });
      await createMailer().send({ to: form.email, ...mail });
    }
    return jsonOk({ message });
  } catch (error) {
    console.error("cuenta_failed", error instanceof Error ? error.message : "unknown");
    const missing = error instanceof Error && error.message.startsWith("Falta la variable");
    return jsonError(
      missing ? "El reenvío no está configurado todavía." : "No pudimos reenviar los enlaces. Intentá de nuevo en un rato.",
      missing ? 503 : 502,
    );
  }
}
