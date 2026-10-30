import { promptsIntro, type Prompt } from "@/content/prompts";
import { site } from "@/content/site";
import { formatBuenosAires } from "@/lib/format";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="es-AR">
  <body style="margin:0;background:#F5F2EB;color:#111;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EB;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:28px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.16em;font-weight:700;">${escapeHtml(site.brand.name.toUpperCase())}</p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.1;letter-spacing:-0.04em;">${escapeHtml(title)}</h1>
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function deliveryEmail(input: {
  productTitle: string;
  downloadUrl: string;
  expiresAt: string;
}): { subject: string; html: string; text: string } {
  const when = formatBuenosAires(new Date(input.expiresAt));
  const url = escapeHtml(input.downloadUrl);
  const subject = `Tu ebook: ${input.productTitle}`;
  const html = shell(
    "Ya podés descargar el PDF",
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.5;">El pago quedó aprobado. Este enlace es personal y vence el ${escapeHtml(when)} (hora de Buenos Aires).</p>
     <p style="margin:0 0 20px;"><a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:12px;letter-spacing:0.14em;font-weight:700;">DESCARGAR PDF</a></p>
     <p style="margin:0;font-size:14px;line-height:1.5;word-break:break-all;"><a href="${url}">${url}</a></p>
     <p style="margin:16px 0 0;font-size:14px;line-height:1.5;">Si el archivo dice que es un marcador de posición, el texto final todavía no estaba publicado al momento de la compra.</p>`,
  );
  const text = `${subject}

El pago quedó aprobado. Descargá el PDF (vence el ${when}, hora de Buenos Aires):
${input.downloadUrl}

Si el archivo dice que es un marcador de posición, el texto final todavía no estaba publicado.`;
  return { subject, html, text };
}

export function promptsEmail(prompts: readonly Prompt[]): { subject: string; html: string; text: string } {
  const subject = "Tus 10 prompts para planificar clases";
  const blocks = prompts
    .map(
      (prompt) =>
        `<h2 style="margin:24px 0 8px;font-size:16px;">${escapeHtml(prompt.title)}</h2><p style="margin:0;font-size:15px;line-height:1.5;">${escapeHtml(prompt.body)}</p>`,
    )
    .join("");
  const html = shell(
    "10 prompts para planificar tus clases",
    `<p style="margin:0 0 8px;font-size:16px;line-height:1.5;">${escapeHtml(promptsIntro)}</p>${blocks}`,
  );
  const text = [subject, "", promptsIntro, "", ...prompts.flatMap((prompt) => [prompt.title, prompt.body, ""])].join(
    "\n",
  );
  return { subject, html, text };
}
