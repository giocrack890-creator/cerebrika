import Link from "next/link";
import { BuyButton } from "@/components/landing/checkout";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { CoverScene } from "@/components/store/cover";
import { ProductCard } from "@/components/store/product-card";
import { categoryLabel, relatedProducts, waitlistSource, type Product } from "@/content/products";
import { site } from "@/content/site";

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

  return (
    <article className="pb-24">
      <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <CoverScene product={product} />
        <div>
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#6B4F3B] uppercase">
            {categoryLabel(product.category)} · {comingSoon ? "Próximamente" : product.badge}
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.3rem,5vw,4.2rem)] leading-[0.98] tracking-[-0.035em]">
            {product.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3F3832]">{product.description}</p>
          <p className="font-display mt-6 text-4xl tracking-[-0.03em]">
            {comingSoon ? "Precio previsto · " : ""}
            {priceLabel ?? "A confirmar"}
          </p>
          {comingSoon ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5E564E]">
              Este ebook todavía no se puede comprar. Dejá el mail y te avisamos cuando esté.
            </p>
          ) : (
            <>
              <BuyButton label={site.hero.cta} className="btn btn-primary mt-6 px-7 py-3.5 text-[16px]" />
              <p className="mt-3 text-sm text-[#5E564E]">{site.hero.priceNote}</p>
              {!product.manuscriptReady ? (
                <p className="mt-5 max-w-lg border-l-2 border-[#8E3F2A] pl-4 text-sm leading-relaxed text-[#5E564E]">
                  {site.placeholderNotice}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-[760px] px-4 py-8 sm:px-6" id="adentro">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#6B4F3B] uppercase">Qué hay adentro</p>
        <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.03em]">El índice</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5E564E]">{product.chaptersNote}</p>
        <ol className="mt-6">
          {product.chapters.map((chapter) => (
            <li key={chapter.number} className="grid grid-cols-[auto_1fr] gap-4 border-t border-black/10 py-4">
              <span className="font-display text-[#8E3F2A]">{chapter.number}</span>
              <span>
                <span className="block font-semibold tracking-[-0.02em]">{chapter.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-[#5E564E]">{chapter.summary}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl tracking-[-0.03em]">Es para vos si</h2>
          <ul className="mt-4 space-y-3">
            {product.forYou.map((item) => (
              <li key={item} className="text-lg leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl tracking-[-0.03em]">No es para vos si</h2>
          <ul className="mt-4 space-y-3 text-[#5E564E]">
            {product.notForYou.map((item) => (
              <li key={item} className="text-lg leading-snug">
                {item}
              </li>
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
          button="Avisame"
          successMessage={site.lead.waitlistSuccess}
        />
      ) : null}
      {comingSoon ? <FaqList items={faq} /> : (
        <>
          <section className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6">
            <div className="rounded-[28px] border border-black/10 bg-[#FBF8F3] px-6 py-8 sm:px-10">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8E3F2A] uppercase">{site.guarantee.kicker}</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.03em]">{site.guarantee.title}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed">{site.guarantee.body}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8E3F2A]">{site.guarantee.flag}</p>
              <BuyButton label={site.hero.cta} className="btn btn-primary mt-6 px-6 py-3.5 text-[15px]" />
            </div>
          </section>
          <FaqList items={faq} />
          <section className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
            <div className="rounded-[32px] bg-[#1B2744] px-6 py-12 text-[#F6F1E8] sm:px-12">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#C4A27A] uppercase">{site.finalCta.kicker}</p>
              <h2 className="font-display mt-3 max-w-[16ch] text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-[-0.03em]">
                {product.promise}
              </h2>
              <p className="mt-4 text-lg text-[#F6F1E8]/75">{site.finalCta.body}</p>
              <p className="font-display mt-5 text-3xl">{priceLabel ?? "Precio a confirmar"}</p>
              <BuyButton label={site.finalCta.button} className="btn btn-light mt-6 px-7 py-3.5 text-[16px]" />
            </div>
          </section>
        </>
      )}

      {related.length > 0 ? (
        <section className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6">
          <h2 className="font-display text-3xl tracking-[-0.03em]">También en la tienda</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mx-auto max-w-[760px] px-4 pb-8 text-sm text-[#5E564E] sm:px-6">
        <Link href="/" className="underline decoration-black/30 underline-offset-4">
          Volver a la tienda
        </Link>
      </p>
    </article>
  );
}
