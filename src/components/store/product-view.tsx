import Link from "next/link";
import { BuyButton } from "@/components/landing/checkout";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { ProductCard, productColor } from "@/components/store/product-card";
import { categoryLabel, relatedProducts, waitlistSource, type Product } from "@/content/products";
import { site } from "@/content/site";

const blackPill =
  "inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";
const whitePill =
  "inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-black";

export function ProductView({
  product,
  priceLabel,
  faq,
}: {
  product: Product;
  priceLabel: string | null;
  faq: readonly { q: string; a: string }[];
}) {
  const comingSoon = product.status === "coming_soon";
  const related = relatedProducts(product.slug);
  const aviso = waitlistSource(product.slug);
  const color = productColor(product.slug);

  return (
    <article className="px-3 pt-28 pb-28 sm:px-6 lg:px-10">
      <section id="inicio" className="flex min-h-[78svh] flex-col items-center justify-center px-3 pb-8 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase">
          {categoryLabel(product.category)} · {comingSoon ? "Próximamente" : product.badge}
        </p>
        <h1 className="mt-6 max-w-5xl text-[clamp(2.8rem,7.4vw,6.4rem)] leading-[0.88] font-bold tracking-[-0.055em]">
          {product.promise}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">{product.description}</p>
        <p className="mt-6 text-sm font-medium tracking-tight">
          {comingSoon ? "Precio previsto · " : "Pago único · "}
          {priceLabel ?? "A confirmar"}
        </p>
        {comingSoon ? (
          <a href={`#aviso-${product.slug}`} className={`${blackPill} mt-8`}>
            AVISAME →
          </a>
        ) : (
          <BuyButton label={site.chrome.barButton} className={`${blackPill} mt-8`} />
        )}
        {!comingSoon && !product.manuscriptReady ? (
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-black/60">{site.placeholderNotice}</p>
        ) : null}
      </section>

      <section
        id="adentro"
        className="grid min-h-[70svh] items-center gap-8 overflow-hidden rounded-[32px] px-6 py-16 text-white sm:px-10 lg:grid-cols-2 lg:px-16"
        style={{ backgroundColor: color }}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/75">QUÉ HAY ADENTRO</p>
          <h2 className="mt-4 max-w-xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.92] font-bold tracking-[-0.05em]">
            {product.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{product.chaptersNote}</p>
        </div>
        <ol className="rounded-[28px] bg-white p-6 text-[#111111] shadow-2xl">
          {product.chapters.map((chapter) => (
            <li key={chapter.number} className="grid grid-cols-[auto_1fr] gap-4 border-t border-black/10 py-4 first:border-t-0">
              <span className="text-xs font-semibold tracking-[0.14em] text-black/45">{chapter.number}</span>
              <span>
                <span className="block font-semibold tracking-[-0.03em]">{chapter.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-black/60">{chapter.summary}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-3 py-20 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold tracking-[-0.045em]">Es para vos si</h2>
          <ul className="mt-6 space-y-4 text-lg leading-relaxed">
            {product.forYou.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-[-0.045em]">No es para vos si</h2>
          <ul className="mt-6 space-y-4 text-lg leading-relaxed text-black/70">
            {product.notForYou.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {comingSoon && aviso ? (
        <LeadForm
          id={`aviso-${product.slug}`}
          source={aviso}
          kicker="Próximamente"
          title="Avisame cuando salga"
          body="Te escribimos a este mail cuando el ebook se pueda comprar. No es una compra ni un pago."
          button="AVISAME"
          successMessage={site.lead.waitlistSuccess}
        />
      ) : (
        <section className="rounded-[32px] px-6 py-16 text-white sm:px-12" style={{ backgroundColor: "#111111" }}>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60">{site.guarantee.kicker.toUpperCase()}</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] font-bold tracking-[-0.05em]">
            {site.guarantee.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{site.guarantee.body}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{site.guarantee.flag}</p>
          <BuyButton label={site.chrome.barButton} className={`${whitePill} mt-8`} />
        </section>
      )}

      <FaqList items={faq} />

      {related.length > 0 ? (
        <section className="py-8">
          <h2 className="px-2 text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em]">También en la tienda</h2>
          <div className="relative mt-8">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} sticky={false} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="px-2 pt-4 text-sm text-black/60">
        <Link href="/" className="font-semibold tracking-[0.12em]">
          VOLVER A LA TIENDA
        </Link>
      </p>
    </article>
  );
}
