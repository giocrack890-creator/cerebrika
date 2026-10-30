import { randomBytes } from "node:crypto";
import { getProduct } from "@/content/products";
import { deliverDigitalOrder } from "@/lib/delivery/deliver-order";
import type { DeliveryDeps } from "@/lib/delivery/types";
import { createResendMailer } from "@/lib/email/resend-mailer";
import { getDownloadTtlHours, getSiteUrl } from "@/lib/env";
import type { NormalizedApprovedPayment } from "@/lib/payments/types";
import { createSupabaseOrderStore } from "@/lib/supabase/order-store";

export function createDeliveryDeps(productTitle: string): DeliveryDeps {
  return {
    store: createSupabaseOrderStore(),
    mailer: createResendMailer(),
    siteUrl: getSiteUrl(),
    productTitle,
    ttlHours: getDownloadTtlHours(),
    now: () => new Date(),
    createToken: () => randomBytes(32).toString("base64url"),
  };
}

export function deliverWithLiveDeps(payment: NormalizedApprovedPayment) {
  const product = getProduct(payment.items?.[0]?.slug ?? payment.productId);
  const title = payment.items?.[0]?.title ?? product?.title ?? payment.productId;
  return deliverDigitalOrder(payment, createDeliveryDeps(title));
}
