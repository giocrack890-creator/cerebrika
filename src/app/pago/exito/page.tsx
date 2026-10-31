import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { TrackProductEvent } from "@/components/analytics/meta-pixel";
import { ResultScreen } from "@/components/landing/result";
import { ClearCartOnMount } from "@/components/store/cart-provider";
import { getProduct, resolvePaidProduct } from "@/content/products";
import { site } from "@/content/site";
import { deliverWithLiveDeps } from "@/lib/delivery/live";
import { fetchMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { deliverApprovedPayment } from "@/lib/payments/process-mercadopago-notification";
import { purchaseEventFromPayment } from "@/lib/payments/purchase-event";
import type { FetchedPayment } from "@/lib/payments/types";
import { createSupabaseOrderStore } from "@/lib/supabase/order-store";

type Query = {
  payment_id?: string | string[];
  collection_id?: string | string[];
  external_reference?: string | string[];
};

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
      <ClearCartOnMount />
      <Suspense fallback={<p className="mt-6 text-[15px] text-muted">Confirmando el pago con Mercado Pago…</p>}>
        <ConfirmedPurchase searchParams={searchParams} />
      </Suspense>
    </ResultScreen>
  );
}

/**
 * Confirma el pago contra la API de Mercado Pago y entrega ahí mismo, sin esperar al webhook.
 * Solo muestra descargas si el external_reference del link coincide con el del pago: es un
 * UUID al azar que solo tiene quien pagó, así que nadie ve descargas ajenas probando ids.
 */
async function ConfirmedPurchase({ searchParams }: { searchParams: Promise<Query> }) {
  await connection();
  const params = await searchParams;
  const paymentId = one(params.payment_id) || one(params.collection_id);
  const reference = one(params.external_reference);
  if (!paymentId || !reference) return <p className="mt-3 text-[15px] leading-relaxed text-muted">{site.payments.successMulti}</p>;

  let payment: FetchedPayment | null = null;
  try {
    payment = await fetchMercadoPagoPayment(paymentId);
  } catch (error) {
    console.error("success_payment_lookup_failed", error instanceof Error ? error.message : "unknown");
  }
  if (!payment || payment.status !== "approved" || payment.externalReference !== reference) {
    return <p className="mt-3 text-[15px] leading-relaxed text-muted">{site.payments.successMulti}</p>;
  }

  try {
    await deliverApprovedPayment(payment, paymentId, {
      acceptProduct: (paid) => {
        const product = resolvePaidProduct(paid);
        return product ? { productId: product.slug, productTitle: product.title } : null;
      },
      deliver: deliverWithLiveDeps,
    });
  } catch (error) {
    // Si falla el mail, el pedido ya quedó grabado: las descargas de abajo igual aparecen.
    console.error("success_delivery_failed", error instanceof Error ? error.message : "unknown");
  }

  let downloads: { title: string; slug: string; downloadToken: string }[] = [];
  try {
    downloads = (await createSupabaseOrderStore().listDownloadsByPayment?.("mercadopago", payment.id || paymentId)) ?? [];
  } catch (error) {
    console.error("success_downloads_failed", error instanceof Error ? error.message : "unknown");
  }

  const purchase = purchaseEventFromPayment(payment);

  return (
    <>
      {downloads.length > 0 ? (
        <div className="mt-6 space-y-3">
          <p className="text-[15px] font-semibold text-ink">Ya podés descargarlo:</p>
          {downloads.map((item) => (
            <a key={item.downloadToken} href={`/descarga/${item.downloadToken}`} className="btn btn-primary h-14 w-full text-[16px] font-extrabold">
              Descargar {getProduct(item.slug)?.cover.headline ?? item.title} (PDF)
            </a>
          ))}
          <p className="text-[13px] leading-relaxed text-subtle">También te lo mandamos por mail. El enlace es personal: no lo compartas.</p>
        </div>
      ) : (
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{site.payments.successMulti}</p>
      )}
      {purchase && process.env.NEXT_PUBLIC_META_PIXEL_ID ? (
        <TrackProductEvent event="Purchase" items={purchase.items} eventId={purchase.eventId} />
      ) : null}
    </>
  );
}
