import type { Metadata } from "next";
import { Container } from "@/components/landing/sections";
import { CartCheckout } from "@/components/store/cart-checkout";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";
import { products } from "@/content/products";
import { site } from "@/content/site";
import { placeholderSlugs } from "@/lib/storage";

export const metadata: Metadata = {
  title: `Carrito · ${site.brand.name}`,
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="pb-12 sm:pb-24">
        <Container className="pt-8 sm:pt-14">
          <h1 className="font-display text-[clamp(2.4rem,9vw,3.5rem)] leading-[0.98] font-bold tracking-[-0.045em]">Carrito</h1>
          <div className="mt-8">
            <CartCheckout placeholderSlugs={placeholderSlugs(products.map((product) => product.slug))} />
          </div>
        </Container>
      </main>
      <StoreFooter />
    </>
  );
}
