import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";
import { getEbookStorage } from "@/lib/env";
import { getServiceClient } from "@/lib/supabase/admin";
import { createSupabaseOrderStore } from "@/lib/supabase/order-store";

function htmlPage(title: string, body: string, status: number): Response {
  const document = `<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F5F2EB;color:#111;font-family:Inter,Arial,sans-serif;padding:24px;">
    <main style="max-width:520px;background:#fff;border-radius:32px;padding:40px;">
      <p style="letter-spacing:0.16em;font-size:12px;font-weight:700;">${site.brand.name.toUpperCase()}</p>
      <h1 style="font-size:36px;letter-spacing:-0.04em;line-height:1;">${title}</h1>
      <p style="font-size:18px;line-height:1.5;">${body}</p>
      <p><a href="/" style="color:#111;">Volver al inicio</a></p>
    </main>
  </body>
</html>`;
  return new Response(document, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(token)) {
    return htmlPage(site.download.invalidTitle, site.download.invalidBody, 404);
  }

  try {
    const order = await createSupabaseOrderStore().getByDownloadToken(token);
    if (!order) {
      return htmlPage(site.download.invalidTitle, site.download.invalidBody, 404);
    }
    if (Date.parse(order.downloadExpiresAt) <= Date.now()) {
      return htmlPage(site.download.expiredTitle, site.download.expiredBody, 410);
    }

    const storage = getEbookStorage();
    if (storage) {
      const signed = await getServiceClient()
        .storage.from(storage.bucket)
        .createSignedUrl(storage.path, 120, { download: site.product.fileName });
      if (signed.error || !signed.data?.signedUrl) {
        console.error("download_storage_failed", signed.error?.message ?? "missing_url");
        return htmlPage(site.download.missingFileTitle, site.download.missingFileBody, 502);
      }
      return Response.redirect(signed.data.signedUrl, 302);
    }

    const bytes = await readFile(path.join(process.cwd(), "private/ebook/placeholder.pdf"));
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ia-para-docentes-placeholder.pdf"',
        "Cache-Control": "private, no-store",
        "X-Ebook-Placeholder": "true",
      },
    });
  } catch (error) {
    console.error("download_failed", error instanceof Error ? error.message : "unknown");
    return htmlPage(site.download.missingFileTitle, site.download.missingFileBody, 502);
  }
}
