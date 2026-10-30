export const PAYMENT_PROVIDERS = ["mercadopago", "lemonsqueezy"] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

/**
 * Pago ya aprobado, independiente del proveedor.
 * Mercado Pago y, más adelante, Lemon Squeezy tienen que terminar en este objeto
 * antes de llamar a deliverDigitalOrder.
 */
export type NormalizedApprovedPayment = {
  provider: PaymentProvider;
  providerPaymentId: string;
  email: string;
  amount: number;
  currency: string;
  productId: string;
  metadata?: Record<string, unknown>;
};

export type FetchedPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  email: string | null;
  externalReference: string | null;
  productId: string | null;
};
