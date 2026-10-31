import { describe, expect, it } from "vitest";
import { parsePixelId, pixelBootstrap, productParams } from "@/lib/analytics/meta-pixel";
import { purchaseEventFromPayment } from "@/lib/payments/purchase-event";
import type { FetchedPayment } from "@/lib/payments/types";

function payment(overrides: Partial<FetchedPayment> = {}): FetchedPayment {
  return {
    id: "123456",
    status: "approved",
    amount: 12000,
    currency: "ARS",
    email: "docente@example.com",
    externalReference: "cart:abc",
    productId: "ia-para-docentes",
    productSlugs: "ia-para-docentes",
    coupon: null,
    ...overrides,
  };
}

describe("píxel de Meta", () => {
  it("acepta solo ids numéricos", () => {
    expect(parsePixelId("1234567890")).toBe("1234567890");
    expect(parsePixelId(" 1234567890 ")).toBe("1234567890");
    expect(parsePixelId("")).toBeNull();
    expect(parsePixelId(undefined)).toBeNull();
    expect(parsePixelId("abc');alert(1);//")).toBeNull();
  });

  it("inicializa con el id validado", () => {
    expect(pixelBootstrap("1234567890")).toContain("fbq('init','1234567890')");
  });

  it("suma el valor en pesos", () => {
    expect(
      productParams([
        { slug: "a", title: "A", price: 1000 },
        { slug: "b", title: "B", price: 500 },
      ]),
    ).toEqual({
      content_ids: ["a", "b"],
      content_name: undefined,
      content_type: "product",
      value: 1500,
      currency: "ARS",
      num_items: 2,
    });
  });
});

describe("Purchase", () => {
  it("sale solo de un pago aprobado, con el monto cobrado", () => {
    const event = purchaseEventFromPayment(payment());
    expect(event).toEqual({
      eventId: "mp-123456",
      items: [{ slug: "ia-para-docentes", title: expect.any(String), price: 12000 }],
    });
  });

  it("no cuenta pagos rechazados, pendientes o sin producto", () => {
    expect(purchaseEventFromPayment(payment({ status: "rejected" }))).toBeNull();
    expect(purchaseEventFromPayment(payment({ status: "pending" }))).toBeNull();
    expect(purchaseEventFromPayment(payment({ productSlugs: "no-existe", productId: null }))).toBeNull();
  });

  it("reparte el total entre varios ebooks sin perder centavos", () => {
    const event = purchaseEventFromPayment(
      payment({ amount: 10001, productSlugs: "ia-para-docentes,ia-para-el-mail,ia-para-la-reunion" }),
    );
    expect(event?.items).toHaveLength(3);
    const total = event!.items.reduce((sum, item) => sum + item.price, 0);
    expect(Math.round(total * 100) / 100).toBe(10001);
  });
});
