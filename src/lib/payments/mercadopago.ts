import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import type { Product } from "@/content/products";
import { chargedUnitPrices, quoteCart } from "@/lib/cart-math";
import { getSiteUrl, isHttpsUrl, prefersSandboxCheckout, requireEnv } from "@/lib/env";
import type { FetchedPayment } from "@/lib/payments/types";

type PaymentLike = {
  id?: number | string;
  status?: string;
  transaction_amount?: number;
  currency_id?: string;
  external_reference?: string;
  metadata?: unknown;
  payer?: { email?: string };
};

function readString(metadata: unknown, key: string): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function mapPayment(payment: PaymentLike): FetchedPayment {
  const metadataProduct = readString(payment.metadata, "product_id");
  const payerEmail = payment.payer?.email?.trim().toLowerCase() || null;
  const metadataEmail = readString(payment.metadata, "buyer_email")?.toLowerCase() ?? null;
  return {
    id: String(payment.id ?? ""),
    status: (payment.status ?? "").toLowerCase(),
    amount: typeof payment.transaction_amount === "number" ? payment.transaction_amount : 0,
    currency: payment.currency_id ?? "ARS",
    email: payerEmail ?? metadataEmail,
    externalReference: payment.external_reference ?? null,
    productId: metadataProduct,
    productSlugs: readString(payment.metadata, "product_slugs"),
    coupon: readString(payment.metadata, "coupon"),
  };
}

export function paymentMatchesProduct(payment: FetchedPayment, productId: string): boolean {
  if (payment.productId === productId) return true;
  return Boolean(payment.externalReference?.startsWith(`${productId}:`));
}

export async function createCheckoutPreference(
  buyerEmail: string,
  productOrList: Product | readonly Product[],
  couponCode?: string,
): Promise<string> {
  const accessToken = requireEnv("MERCADOPAGO_ACCESS_TOKEN");
  const list = Array.isArray(productOrList) ? productOrList : [productOrList];
  const quote = quoteCart(
    list.map((product) => product.slug),
    couponCode,
  );
  if (!quote.ok) {
    throw new Error(quote.error === "missing_price" ? "PRICE_ARS tiene que ser un entero mayor a cero." : "El carrito no se puede cobrar.");
  }
  const charged = chargedUnitPrices(quote.lines, quote.total);

  const siteUrl = getSiteUrl();
  const https = isHttpsUrl(siteUrl);
  const client = new MercadoPagoConfig({ accessToken });
  const preference = await new Preference(client).create({
    body: {
      items: quote.lines.map((line, index) => ({
        id: line.slug,
        title: line.title,
        description: "Ebook en PDF. Entrega por email.",
        quantity: 1,
        unit_price: charged[index],
        currency_id: "ARS",
      })),
      payer: { email: buyerEmail },
      external_reference: `cart:${crypto.randomUUID()}`,
      metadata: {
        product_id: quote.lines[0]?.slug ?? "",
        product_slug: quote.lines[0]?.slug ?? "",
        product_slugs: quote.lines.map((line) => line.slug).join(","),
        buyer_email: buyerEmail,
        coupon: quote.coupon ?? "",
        expected_total: String(quote.total),
      },
      binary_mode: true,
      statement_descriptor: "CEREBRIKA",
      back_urls: {
        success: `${siteUrl}/pago/exito`,
        failure: `${siteUrl}/pago/error`,
        pending: `${siteUrl}/pago/pendiente`,
      },
      ...(https
        ? {
            auto_return: "approved",
            notification_url: `${siteUrl}/api/webhooks/mercadopago`,
          }
        : {}),
    },
  });

  const useSandbox = prefersSandboxCheckout();
  const initPoint =
    useSandbox && preference.sandbox_init_point ? preference.sandbox_init_point : preference.init_point;
  if (!initPoint) {
    throw new Error("Mercado Pago no devolvió el enlace de pago.");
  }
  return initPoint;
}

export async function fetchMercadoPagoPayment(id: string): Promise<FetchedPayment> {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
    throw new Error("Identificador de pago inválido.");
  }
  const client = new MercadoPagoConfig({ accessToken: requireEnv("MERCADOPAGO_ACCESS_TOKEN") });
  const payment = await new Payment(client).get({ id });
  return mapPayment(payment);
}
