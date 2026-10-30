import { z } from "zod";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  company: z.string().optional(),
});

export type ParsedForm =
  | { ok: true; email: string; honeypot: boolean }
  | { ok: false; error: string };

export async function parseContactForm(request: Request): Promise<ParsedForm> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { ok: false, error: "Ingresá un email válido." };
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  return {
    ok: true,
    email: parsed.data.email,
    honeypot: Boolean(parsed.data.company?.trim()),
  };
}

export function jsonError(error: string, status: number): Response {
  return Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonOk(body: Record<string, unknown>, status = 200): Response {
  return Response.json({ ok: true, ...body }, { status, headers: { "Cache-Control": "no-store" } });
}
