import Link from "next/link";
import { ClearCartOnMount } from "@/components/store/cart-provider";
import { site } from "@/content/site";

export default function SuccessPage() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#F5F2EB] px-6 py-16">
      <ClearCartOnMount />
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 sm:p-12">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase">{site.brand.name}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em]">{site.payments.successTitle}</h1>
        <p className="mt-4 text-lg leading-relaxed text-black/70">{site.payments.successBody}</p>
        <p className="mt-4 text-base leading-relaxed text-black/70">
          Si compraste más de un ebook, el mail trae un enlace por título.
        </p>
        <Link href="/cuenta" className="mt-8 inline-flex rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white">
          MIS COMPRAS
        </Link>
      </div>
    </main>
  );
}
