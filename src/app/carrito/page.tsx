import type { Metadata } from "next";
import Link from "next/link";
import { StoreFooter } from "@/components/store/footer";
import { StoreChrome } from "@/components/store/header";
import { CartCheckout } from "@/components/store/cart-checkout";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Carrito · ${site.brand.name}`,
};

const cornerClass = "rounded-full bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";

export default function CartPage() {
  return (
    <>
      <StoreChrome
        bar="Tu carrito"
        showBar={false}
        corner={
          <Link href="/catalogo" className={cornerClass}>
            CATÁLOGO
          </Link>
        }
        barAction={null}
      />
      <main id="inicio" className="mx-auto max-w-5xl px-6 pt-10 pb-24">
        <h1 className="text-[clamp(2.8rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.055em]">Carrito</h1>
        <div className="mt-8">
          <CartCheckout />
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
