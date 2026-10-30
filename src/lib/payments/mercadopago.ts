import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { site } from "@/content/site";
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
  };
}

export function paymentMatchesProduct(payment: FetchedPayment, productId: string): boolean {
  if (payment.productId === productId) return true;
  return Boolean(payment.externalReference?.startsWith(`${productId}:`));
}

export async function createCheckoutPreference(buyerEmail: string): Promise<string> {
  const accessToken = requireEnv("MERCADOPAGO_ACCESS_TOKEN");
  const price = Number(requireEnv("PRICE_ARS"));
  if (!Number.isSafeInteger(price) || price <= 0) {
    throw new Error("PRICE_ARS tiene que ser un entero mayor a cero.");
  }

  const siteUrl = getSiteUrl();
  const https = isHttpsUrl(siteUrl);
  const client = new MercadoPagoConfig({ accessToken });
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: site.product.id,
          title: site.product.title,
          description: "Ebook en PDF. Entrega por email.",
          quantity: 1,
          unit_price: price,
          currency_id: "ARS",
        },
      ],
      payer: { email: buyerEmail },
      external_reference: `${site.product.id}:${crypto.randomUUID()}`,
      metadata: {
        product_id: site.product.id,
        buyer_email: buyerEmail,
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
