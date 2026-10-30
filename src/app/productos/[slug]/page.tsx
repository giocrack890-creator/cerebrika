import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { CheckoutProvider } from "@/components/landing/checkout";
import { StoreFooter } from "@/components/store/footer";
import { StoreHeader } from "@/components/store/header";
import { BuyBar } from "@/components/store/buy-bar";
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
    <Suspense fallback={<StoreHeader />}>
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
  const faq =
    product.status === "available"
      ? fillFaq(priceLabel ?? "a confirmar", getDownloadTtlHours())
      : [
          {
            q: "¿Ya se puede comprar?",
            a: "No. El ebook está anunciado y todavía no está a la venta. Si dejás el mail, te avisamos cuando se pueda comprar.",
          },
          {
            q: "¿El mail implica un pago?",
            a: "No. Solo guardamos el correo para ese aviso.",
          },
        ];

  const body = (
    <>
      <StoreHeader />
      <main>
        <ProductView product={product} priceLabel={priceLabel} faq={faq} />
        <StoreFooter />
      </main>
      {product.status === "available" ? <BuyBar priceLabel={priceLabel} label="Comprar" /> : null}
    </>
  );

  if (product.status !== "available") return body;

  return (
    <CheckoutProvider productSlug={product.slug} productTitle={product.title} priceLabel={priceLabel}>
      {body}
    </CheckoutProvider>
  );
}
