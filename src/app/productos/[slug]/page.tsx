import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";
import { ProductView } from "@/components/store/product-view";
import { getProduct, products, resolvePriceArs } from "@/content/products";
import { fillFaq, site } from "@/content/site";
import { getDownloadTtlHours } from "@/lib/env";
import { formatArs } from "@/lib/format";

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
          a: "Todavía no. El ebook está anunciado y no está a la venta. Si dejás el mail, te avisamos cuando se pueda comprar.",
        },
        {
          q: "¿Dejar el mail implica un pago?",
          a: "No. Solo guardamos el correo para ese aviso.",
        },
      ]
    : fillFaq(priceLabel ?? "el que figura al pagar", getDownloadTtlHours());

  const body = (
    <>
      <SiteHeader
        cta={
          comingSoon ? (
            <Link href={`#aviso-${product.slug}`} className="btn btn-ink btn-sm">
              Avisame
            </Link>
          ) : (
            <BuyButton className="btn btn-primary btn-sm">Comprar</BuyButton>
          )
        }
      />
      <main>
        <ProductView product={product} price={price} faq={faq} />
      </main>
      <StoreFooter />
    </>
  );

  if (comingSoon) return body;

  return (
    <CheckoutProvider
      productSlug={product.slug}
      productTitle={product.title}
      price={price}
      placeholderNotice={product.manuscriptReady ? null : site.placeholderNotice}
    >
      {body}
    </CheckoutProvider>
  );
}
