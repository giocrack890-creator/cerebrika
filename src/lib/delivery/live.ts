import { randomBytes } from "node:crypto";
import { site } from "@/content/site";
import { deliverDigitalOrder } from "@/lib/delivery/deliver-order";
import type { DeliveryDeps } from "@/lib/delivery/types";
import { createResendMailer } from "@/lib/email/resend-mailer";
import { getDownloadTtlHours, getSiteUrl } from "@/lib/env";
import type { NormalizedApprovedPayment } from "@/lib/payments/types";
import { createSupabaseOrderStore } from "@/lib/supabase/order-store";

export function createDeliveryDeps(): DeliveryDeps {
  return {
    store: createSupabaseOrderStore(),
    mailer: createResendMailer(),
    siteUrl: getSiteUrl(),
    productTitle: site.product.title,
    ttlHours: getDownloadTtlHours(),
    now: () => new Date(),
    createToken: () => randomBytes(32).toString("base64url"),
  };
}

export function deliverWithLiveDeps(payment: NormalizedApprovedPayment) {
  return deliverDigitalOrder(payment, createDeliveryDeps());
}
