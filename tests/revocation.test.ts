import { describe, expect, it } from "vitest";
import { parseRevocation, revocationCode, revocationSellerEmail } from "@/lib/revocation";

describe("botón de arrepentimiento", () => {
  it("pide solo el email; operación y motivo son opcionales", () => {
    const parsed = parseRevocation({ email: " Docente@Example.com " });
    expect(parsed).toEqual({ ok: true, data: { email: "docente@example.com", orderRef: null, reason: null, honeypot: false } });
    expect(parseRevocation({ email: "no-es-mail" }).ok).toBe(false);
  });

  it("marca el honeypot sin rechazar", () => {
    const parsed = parseRevocation({ email: "a@b.co", company: "bot" });
    expect(parsed.ok && parsed.data.honeypot).toBe(true);
  });

  it("arma un código legible y sin caracteres ambiguos", () => {
    const code = revocationCode(new Uint8Array([0, 1, 2, 3, 4, 31]));
    expect(code).toMatch(/^ARR-[A-HJ-NP-Z2-9]{6}$/);
    expect(revocationCode()).toMatch(/^ARR-[A-HJ-NP-Z2-9]{6}$/);
  });

  it("escapa lo que escribe la persona en el aviso al vendedor", () => {
    const mail = revocationSellerEmail("ARR-ABCDEF", { email: "a@b.co", orderRef: null, reason: "<script>", honeypot: false });
    expect(mail.html).not.toContain("<script>");
    expect(mail.text).toContain("ARR-ABCDEF");
  });
});
