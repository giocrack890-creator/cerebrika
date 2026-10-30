import { describe, expect, it } from "vitest";
import { brandFromAddress } from "@/lib/email/resend-mailer";

describe("remitente Cerebrika", () => {
  it("pone el nombre de la marca aunque el env traiga solo el correo", () => {
    expect(brandFromAddress("hola@cerebrika.com")).toBe("Cerebrika <hola@cerebrika.com>");
  });

  it("reemplaza otro nombre visible y conserva el correo", () => {
    expect(brandFromAddress("Otra marca <hola@cerebrika.com>")).toBe("Cerebrika <hola@cerebrika.com>");
  });
});