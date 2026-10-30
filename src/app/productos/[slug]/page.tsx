import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { ProductView } from "@/components/store/product-view";
import { getProduct, products, resolvePriceArs } from "@/content/products";
import { fillFaq, site } from "@/content/site";
import { getDownloadTtlHours } from "@/lib/env";
import { formatArs } from "@/lib/format";

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const barClass =
  "shrink-0 rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-white";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: site.brand.name };
  return {
    title: `${product.title} · ${site.brand.name}`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <LiveProduct params={params} />
    </Suspense>
  );
}

async function LiveProduct({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const price = resolvePriceArs(product);
  const priceLabel = price ? formatArs(price) : null;
  const comingSoon = product.status !== "available";
  const faq = comingSoon
    ? [
        {
          q: "¿Ya se puede comprar?",
          a: "No. El ebook está anunciado y todavía no está a la venta. Si dejás el mail, te avisamos cuando se pueda comprar.",
        },
        {
          q: "¿El mail implica un pago?",
          a: "No. Solo guardamos el correo para ese aviso.",
        },
      ]
    : fillFaq(priceLabel ?? "a confirmar", getDownloadTtlHours());

  const avisoHref = `#aviso-${product.slug}`;
  const chrome = (
    <StoreChrome
      showBar={false}
      bar={comingSoon ? "Próximamente · te avisamos" : priceLabel ? `${product.promise} · ${priceLabel}` : product.promise}
      corner={
        comingSoon ? (
          <Link href={avisoHref} className={cornerClass}>
            AVISAME
          </Link>
        ) : (
          <BuyButton label={site.chrome.buy} className={cornerClass} />
        )
      }
      barAction={
        comingSoon ? (
          <Link href={avisoHref} className={barClass}>
            AVISAME →
          </Link>
        ) : (
          <BuyButton label={site.chrome.barButton} className={barClass} />
        )
      }
    />
  );

  const body = (
    <>
      {chrome}
      <main>
        <ProductView product={product} priceLabel={priceLabel} faq={faq} />
        <StoreFooter />
      </main>
    </>
  );

  if (comingSoon) return body;

  return (
    <CheckoutProvider productSlug={product.slug} productTitle={product.title} priceLabel={priceLabel}>
      {body}
    </CheckoutProvider>
  );
}
