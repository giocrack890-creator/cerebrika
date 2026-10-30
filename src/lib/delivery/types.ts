import type { NormalizedApprovedPayment } from "@/lib/payments/types";

export type EmailStatus = "pending" | "sending" | "sent";

export type OrderRecord = {
  id: string;
  provider: NormalizedApprovedPayment["provider"];
  providerPaymentId: string;
  productId: string;
  productSlug: string;
  email: string;
  amount: number;
  currency: string;
  downloadToken: string;
  downloadExpiresAt: string;
  emailStatus: EmailStatus;
  emailClaimedAt: string | null;
  emailSentAt: string | null;
};

export type NewOrderInput = {
  provider: NormalizedApprovedPayment["provider"];
  providerPaymentId: string;
  productId: string;
  productSlug: string;
  email: string;
  amount: number;
  currency: string;
  downloadToken: string;
  downloadExpiresAt: string;
  metadata: Record<string, unknown>;
};

export interface OrderStore {
  insertIfAbsent(input: NewOrderInput): Promise<{ order: OrderRecord; created: boolean }>;
  getById(id: string): Promise<OrderRecord | null>;
  getByDownloadToken(token: string): Promise<OrderRecord | null>;
  claimEmailSend(id: string, now: Date): Promise<boolean>;
  markEmailSent(id: string, now: Date): Promise<void>;
  releaseEmailClaim(id: string): Promise<void>;
}

export interface Mailer {
  send(message: { to: string; subject: string; html: string; text: string }): Promise<void>;
}

export type DeliverResult = {
  outcome: "delivered" | "duplicate" | "retried";
  orderId: string;
};

export type DeliveryDeps = {
  store: OrderStore;
  mailer: Mailer;
  siteUrl: string;
  productTitle: string;
  ttlHours: number;
  now: () => Date;
  createToken: () => string;
};
