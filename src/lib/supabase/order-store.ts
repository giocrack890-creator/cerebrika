import type { NewOrderInput, OrderRecord, OrderStore } from "@/lib/delivery/types";
import type { PaymentProvider } from "@/lib/payments/types";
import { getServiceClient } from "@/lib/supabase/admin";

const CLAIM_STALE_MS = 5 * 60 * 1000;

type OrderRow = {
  id: number | string;
  provider: string;
  provider_payment_id: string;
  product_id: string;
  product_slug?: string | null;
  email: string;
  amount: number | string;
  currency: string;
  download_token: string;
  download_expires_at: string;
  email_status: OrderRecord["emailStatus"];
  email_claimed_at: string | null;
  email_sent_at: string | null;
};

function mapRow(row: OrderRow): OrderRecord {
  const provider: PaymentProvider = row.provider === "lemonsqueezy" ? "lemonsqueezy" : "mercadopago";
  return {
    id: String(row.id),
    provider,
    providerPaymentId: row.provider_payment_id,
    productId: row.product_id,
    productSlug: row.product_slug || row.product_id,
    email: row.email,
    amount: Number(row.amount),
    currency: row.currency,
    downloadToken: row.download_token,
    downloadExpiresAt: row.download_expires_at,
    emailStatus: row.email_status,
    emailClaimedAt: row.email_claimed_at,
    emailSentAt: row.email_sent_at,
  };
}

export function createSupabaseOrderStore(): OrderStore {
  const supabase = getServiceClient();

  return {
    async insertIfAbsent(input: NewOrderInput) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          provider: input.provider,
          provider_payment_id: input.providerPaymentId,
          product_id: input.productId,
          product_slug: input.productSlug,
          status: "approved",
          email: input.email,
          amount: input.amount,
          currency: input.currency,
          download_token: input.downloadToken,
          download_expires_at: input.downloadExpiresAt,
          email_status: "pending",
          metadata: input.metadata,
        })
        .select("*")
        .single();

      if (error?.code === "23505") {
        const existing = await supabase
          .from("orders")
          .select("*")
          .eq("provider", input.provider)
          .eq("provider_payment_id", input.providerPaymentId)
          .single();
        if (existing.error || !existing.data) {
          throw existing.error ?? new Error("No se pudo leer el pedido existente.");
        }
        return { order: mapRow(existing.data as OrderRow), created: false };
      }

      if (error || !data) {
        throw error ?? new Error("No se pudo guardar el pedido.");
      }

      return { order: mapRow(data as OrderRow), created: true };
    },

    async getById(id) {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data as OrderRow) : null;
    },

    async getByDownloadToken(token) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("download_token", token)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data as OrderRow) : null;
    },

    async claimEmailSend(id, now) {
      const claimedAt = now.toISOString();
      const pending = await supabase
        .from("orders")
        .update({ email_status: "sending", email_claimed_at: claimedAt })
        .eq("id", id)
        .eq("email_status", "pending")
        .select("id")
        .maybeSingle();
      if (pending.error) throw pending.error;
      if (pending.data) return true;

      const staleBefore = new Date(now.getTime() - CLAIM_STALE_MS).toISOString();
      const stale = await supabase
        .from("orders")
        .update({ email_claimed_at: claimedAt })
        .eq("id", id)
        .eq("email_status", "sending")
        .lt("email_claimed_at", staleBefore)
        .select("id")
        .maybeSingle();
      if (stale.error) throw stale.error;
      return Boolean(stale.data);
    },

    async markEmailSent(id, now) {
      const { error } = await supabase
        .from("orders")
        .update({ email_status: "sent", email_sent_at: now.toISOString() })
        .eq("id", id);
      if (error) throw error;
    },

    async releaseEmailClaim(id) {
      const { error } = await supabase
        .from("orders")
        .update({ email_status: "pending", email_claimed_at: null })
        .eq("id", id)
        .eq("email_status", "sending");
      if (error) throw error;
    },
  };
}
