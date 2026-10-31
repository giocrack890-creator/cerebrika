import Link from "next/link";
import { TrackProductEvent } from "@/components/analytics/meta-pixel";
import { BuyButton } from "@/components/landing/checkout";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { Container, FitLists, PlaceholderNotice, SectionHeading, TrustRow } from "@/components/landing/sections";
import { AddToCartButton } from "@/components/store/cart-provider";
import { ChapterList } from "@/components/store/chapter-list";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery, ShareButton } from "@/components/store/product-gallery";
import { RecentlyViewed, RememberView } from "@/components/store/recently-viewed";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { CheckIcon } from "@/components/ui/icons";
import { categoryLabel, getProduct, relatedProducts, waitlistSource, type Product } from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

export function ProductView({
  product,
  price,
  faq,
}: {
  product: Product;
  price: number | null;
  faq: readonly { q: string; a: string }[];
}) {
  const comingSoon = product.status === "coming_soon";
  const priceLabel = price ? formatArs(price) : null;
  const related = relatedProducts(product.slug).filter((item) => item.slug !== product.pairsWith);
  const aviso = waitlistSource(product.slug);
  const pair = product.pairsWith ? getProduct(product.pairsWith) : undefined;
  const placeholder = !comingSoon && !product.manuscriptReady;
  const showCompare = !comingSoon && product.compareAtArs !== null && price !== null && product.compareAtArs > price;
  const avisoHref = `#aviso-${product.slug}`;

  return (
    <article id="contenido">
      <RememberView slug={product.slug} />
      <Container className="pt-4 sm:pt-8">
        <nav aria-label="Ruta" className="flex items-center gap-2 overflow-hidden text-[13px] text-subtle">
          <Link href="/catalogo" className="shrink-0 hover:text-ink">
            Catálogo
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/catalogo?categoria=${product.category}`} className="shrink-0 hover:text-ink">
            {categoryLabel(product.category)}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-muted" aria-current="page">
            {product.cover.headline}
          </span>
        </nav>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <ProductGallery product={product} />
          <div className="lg:pt-4">
            <div className="flex items-center justify-between gap-4">
              <p
                className={`rounded-full px-3 py-1 text-[13px] font-medium ${comingSoon ? "bg-line/70 text-muted" : "bg-accent-soft text-accent-ink"}`}
              >
                {comingSoon ? "Próximamente" : "Disponible · PDF por mail"}
              </p>
              <ShareButton title={product.title} />
            </div>
            <h1 className="font-display mt-4 text-[clamp(2.1rem,8vw,3.5rem)] leading-[0.98] font-black tracking-[-0.045em]">
              {product.promise}
            </h1>
            <p className="mt-3 text-[15px] font-medium text-muted">{product.title}</p>
            <p className="mt-4 font-serif text-[17px] leading-relaxed text-ink">{product.description}</p>

            {product.rating && product.rating.count > 0 ? (
              <p className="mt-4 text-[14px] font-medium">
                {product.rating.score.toFixed(1)} de 5 · {product.rating.count} opiniones
              </p>
            ) : null}

            <div className="mt-6 flex items-baseline gap-3">
              <p className="font-display text-[34px] font-bold tracking-[-0.03em]">{priceLabel ?? "A confirmar"}</p>
              {showCompare && product.compareAtArs ? (
                <p className="text-[18px] text-subtle line-through">{formatArs(product.compareAtArs)}</p>
              ) : null}
            </div>
            <p className="mt-1 text-[14px] text-muted">
              {comingSoon ? "Precio previsto. Todavía no se cobra." : "Pago único con Mercado Pago. Sin suscripción."}
            </p>
            {product.promoSavingsArs && product.promoSavingsArs > 0 && !comingSoon ? (
              <p className="mt-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent-ink">
                Precio de lanzamiento · ahorrás {formatArs(product.promoSavingsArs)}
              </p>
            ) : null}

            <div id="product-cta" className="mt-6 flex flex-col gap-2 sm:flex-row">
              {comingSoon ? (
                <a href={avisoHref} className="btn btn-ink h-14 w-full sm:w-auto">
                  Avisame cuando salga
                </a>
              ) : (
                <>
                  <BuyButton className="btn btn-primary h-14 w-full px-6 text-[16px] sm:w-auto">Comprar ahora</BuyButton>
                  <AddToCartButton slug={product.slug} className="btn btn-ghost h-14 w-full sm:w-auto" />
                </>
              )}
            </div>
            {placeholder ? <PlaceholderNotice className="mt-4" /> : null}

            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {product.outcomes.map((item) => (
                <li key={item} className="flex gap-3 font-serif text-[16px] leading-snug">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {!comingSoon ? (
        <Container className="mt-14">
          <TrustRow />
        </Container>
      ) : null}

      <section id="adentro" className="scroll-mt-20 py-12 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading kicker={site.chapters.kicker} title={site.chapters.title} body={product.chaptersNote} />
          <div className="reveal">
            <ChapterList chapters={product.chapters} />
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 sm:py-24">
        <Container>
          <SectionHeading kicker={site.audience.kicker} title="¿Es para vos?" />
          <div className="mt-10">
            <FitLists yes={product.forYou} no={product.notForYou} />
          </div>
        </Container>
      </section>

      {comingSoon && aviso ? (
        <section className="py-12 sm:py-24">
          <Container>
            <LeadForm
              id={`aviso-${product.slug}`}
              source={aviso}
              kicker="Próximamente"
              title="Avisame cuando salga"
              body="Te escribimos a este mail cuando el ebook se pueda comprar. No es una compra ni un pago."
              button="Avisame"
              successMessage={site.lead.waitlistSuccess}
            />
          </Container>
        </section>
      ) : null}

      {!comingSoon && site.guarantee.confirmed ? (
        <section className="pt-12 sm:pt-24">
          <Container>
            <div className="rounded-[24px] bg-ink px-5 py-10 text-white sm:px-10">
              <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-[-0.035em]">{site.guarantee.title}</h2>
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/75">{site.guarantee.body}</p>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-12 sm:py-24">
        <Container>
          <FaqList items={faq} />
        </Container>
      </section>

      {pair || related.length > 0 ? (
        <section className="border-t border-line py-12 sm:py-24">
          <Container>
            <SectionHeading kicker="Más de Cerebrika" title={pair ? "Combina bien con este" : "También en la tienda"} />
            <div className="no-scrollbar -mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
              {[...(pair ? [pair] : []), ...related].slice(0, 4).map((item) => (
                <div key={item.slug} className="w-[200px] shrink-0 snap-start sm:w-auto">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <RecentlyViewed current={product.slug} />

      <StickyBuyBar
        watchId="product-cta"
        title={product.cover.headline}
        detail={comingSoon ? "Próximamente" : priceLabel ? `${priceLabel} · pago único` : "Pago único"}
      >
        {comingSoon ? (
          <a href={avisoHref} className="btn btn-light h-12 w-full font-bold sm:w-auto">
            Avisame cuando salga
          </a>
        ) : (
          <BuyButton className="btn btn-light h-12 w-full font-bold sm:w-auto">Comprar el ebook{priceLabel ? ` — ${priceLabel}` : ""}</BuyButton>
        )}
      </StickyBuyBar>
      {!comingSoon && price ? (
        <TrackProductEvent event="ViewContent" items={[{ slug: product.slug, title: product.title, price }]} />
      ) : null}
    </article>
  );
}
