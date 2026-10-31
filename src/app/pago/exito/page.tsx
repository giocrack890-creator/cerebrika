import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { TrackProductEvent } from "@/components/analytics/meta-pixel";
import { ResultScreen } from "@/components/landing/result";
import { ClearCartOnMount } from "@/components/store/cart-provider";
import { site } from "@/content/site";
import { fetchMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { purchaseEventFromPayment, type PurchaseEvent } from "@/lib/payments/purchase-event";

type Query = { payment_id?: string | string[]; collection_id?: string | string[] };

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim();
}

export default function SuccessPage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <ResultScreen
      tone="success"
      title={site.payments.successTitle}
      body={site.payments.successBody}
      action={
        <Link href="/cuenta" className="btn btn-primary">
          {site.payments.successAccount}
        </Link>
      }
    >
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{site.payments.successMulti}</p>
      <ClearCartOnMount />
      <Suspense fallback={null}>
        <PurchasePixel searchParams={searchParams} />
      </Suspense>
    </ResultScreen>
  );
}

/** Confirma el pago contra Mercado Pago antes de mandar Purchase al píxel. */
async function PurchasePixel({ searchParams }: { searchParams: Promise<Query> }) {
  await connection();
  const params = await searchParams;
  const paymentId = one(params.payment_id) || one(params.collection_id);
  if (!paymentId || !process.env.NEXT_PUBLIC_META_PIXEL_ID) return null;

  let event: PurchaseEvent | null = null;
  try {
    event = purchaseEventFromPayment(await fetchMercadoPagoPayment(paymentId));
  } catch (error) {
    console.error("purchase_pixel_lookup_failed", error instanceof Error ? error.message : "unknown");
  }
  if (!event) return null;
  return <TrackProductEvent event="Purchase" items={event.items} eventId={event.eventId} />;
}
