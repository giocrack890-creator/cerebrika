import Link from "next/link";
import { BuyButton } from "@/components/landing/checkout";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { BookCover } from "@/components/store/book-cover";
import { ChapterList } from "@/components/store/chapter-list";
import { ProductGallery, ShareButton } from "@/components/store/product-gallery";
import { ProductCard } from "@/components/store/product-card";
import { RecentlyViewed, RememberView } from "@/components/store/recently-viewed";
import { categoryLabel, formats, getProduct, relatedProducts, waitlistSource, type Product } from "@/content/products";
import { site } from "@/content/site";
import { formatArs } from "@/lib/format";

const blackPill =
  "inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white";

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
  const pair = product.pairsWith ? getProduct(product.pairsWith) : undefined;
  const showCompare = product.compareAtArs !== null && priceLabel !== null && product.compareAtArs > (product.priceArs || 0);
  const cta = (key: string) =>
    comingSoon ? (
      <a key={key} href={`#aviso-${product.slug}`} className={blackPill}>
        AVISAME →
      </a>
    ) : (
      <BuyButton key={key} label={site.chrome.barButton} className={blackPill} />
    );

  return (
    <article className="px-3 pt-28 pb-32 sm:px-6 lg:px-10 xl:pl-28">
      <RememberView slug={product.slug} />
      <p className="text-[11px] font-semibold tracking-[0.16em] text-black/55">
        <Link href="/">TIENDA</Link>
        <span className="px-2">/</span>
        <Link href={`/catalogo?categoria=${product.category}`}>{categoryLabel(product.category).toUpperCase()}</Link>
        <span className="px-2">/</span>
        <span className="text-black">{product.title.toUpperCase()}</span>
      </p>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery product={product} />
        <div id="inicio">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[11px] font-semibold tracking-[0.16em]">
              {comingSoon ? "PRÓXIMAMENTE" : "LLEGA POR MAIL"}
            </p>
            <p className="text-[11px] font-semibold tracking-[0.16em]">PDF</p>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-black/50">
              PREVISTO · {product.pages} PÁGS · {product.minutes} MIN
            </p>
            <ShareButton title={product.title} />
          </div>
          {product.rating && product.rating.count > 0 ? (
            <p className="mt-3 text-sm font-semibold">
              {product.rating.score.toFixed(1)} · {product.rating.count} opiniones
            </p>
          ) : null}
          {product.soldCount && product.soldCount > 0 ? (
            <p className="mt-1 text-sm text-black/60">{product.soldCount} compras registradas</p>
          ) : null}
          <h1 className="mt-4 max-w-xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.055em]">
            {product.promise}
          </h1>
          <p className="mt-3 text-sm font-medium tracking-tight text-black/60">{product.title}</p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-black/70">{product.description}</p>

          {product.promoSavingsArs && product.promoSavingsArs > 0 ? (
            <p className="mt-6 inline-flex rounded-full bg-[#3730A3] px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-white">
              PRECIO DE LANZAMIENTO · AHORRÁS {formatArs(product.promoSavingsArs)}
            </p>
          ) : null}

          <div className="mt-6 flex items-end gap-3">
            <p className="text-4xl font-bold tracking-[-0.045em]">{priceLabel ?? "A confirmar"}</p>
            {showCompare && product.compareAtArs ? (
              <p className="pb-1 text-lg text-black/40 line-through">{formatArs(product.compareAtArs)}</p>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-black/60">
            {comingSoon ? "Precio previsto. Todavía no se cobra." : "Pago único. Mercado Pago: tarjeta, débito o dinero en cuenta."}
          </p>

          <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Formato">
            {formats.map((format) => (
              <button
                key={format.id}
                type="button"
                disabled={!format.active}
                aria-checked={format.active}
                role="radio"
                className={`rounded-full px-4 py-3 text-[11px] font-semibold tracking-[0.12em] ${
                  format.active ? "bg-black text-white" : "bg-white text-black/35"
                }`}
              >
                {format.label.toUpperCase()}
                {format.active ? "" : " · PRÓXIMAMENTE"}
              </button>
            ))}
          </div>

          <div className="mt-6">{cta("main")}</div>
          {!comingSoon && !product.manuscriptReady ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-black/60">{site.placeholderNotice}</p>
          ) : null}
        </div>
      </div>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-[clamp(2.2rem,5vw,3.4rem)] font-bold tracking-[-0.045em]">Qué vas a lograr</h2>
        <ul className="mt-6 space-y-3 text-lg leading-snug">
          {product.outcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="adentro" className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-[clamp(2.2rem,5vw,3.4rem)] font-bold tracking-[-0.045em]">Qué hay adentro</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/60">{product.chaptersNote}</p>
        <ChapterList chapters={product.chapters} />
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold tracking-[-0.045em]">Es para vos si</h2>
          <ul className="mt-6 space-y-4 text-lg">{product.forYou.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-[-0.045em]">No es para vos si</h2>
          <ul className="mt-6 space-y-4 text-lg text-black/70">{product.notForYou.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {comingSoon && aviso ? (
        <div className="mt-10">
          <LeadForm
            id={`aviso-${product.slug}`}
            source={aviso}
            kicker="Próximamente"
            title="Avisame cuando salga"
            body="Te escribimos a este mail cuando el ebook se pueda comprar. No es una compra ni un pago."
            button="AVISAME"
            successMessage={site.lead.waitlistSuccess}
          />
        </div>
      ) : (
        <section className="mt-12 rounded-[32px] bg-[#111111] px-6 py-12 text-white sm:px-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60">{site.guarantee.kicker.toUpperCase()}</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.92] font-bold tracking-[-0.05em]">
            {site.guarantee.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{site.guarantee.body}</p>
          <p className="mt-3 max-w-2xl text-sm text-white/60">{site.guarantee.flag}</p>
          <div className="mt-8">{cta("guarantee")}</div>
        </section>
      )}

      <section className="mt-12 grid gap-3 sm:grid-cols-3">
        {[
          ["Pago con Mercado Pago", "Tarjeta, débito o dinero en cuenta."],
          ["Te llega por mail", "El enlace sale cuando el pago se aprueba."],
          ["Un solo pago", "Sin suscripción."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[24px] bg-white px-5 py-5">
            <p className="text-sm font-semibold tracking-[-0.02em]">{title}</p>
            <p className="mt-2 text-sm leading-snug text-black/65">{body}</p>
          </div>
        ))}
      </section>

      <FaqList items={faq.slice(0, 6)} />

      {pair ? (
        <section className="mt-4">
          <h2 className="text-4xl font-bold tracking-[-0.045em]">Combiná con</h2>
          <div className="mt-6 max-w-sm">
            <ProductCard product={pair} layout="tile" />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-4xl font-bold tracking-[-0.045em]">También en la tienda</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {related.map((item) => (
              <div key={item.slug} className="w-[280px] shrink-0">
                <ProductCard product={item} layout="tile" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <RecentlyViewed current={product.slug} />

      <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-2 shadow-[0_12px_40px_rgba(17,17,17,0.14)] lg:inset-x-auto lg:bottom-8 lg:left-1/2 lg:w-[min(720px,calc(100%-4rem))] lg:-translate-x-1/2">
        <div className="hidden w-12 shrink-0 sm:block">
          <BookCover product={product} />
        </div>
        <div className="min-w-0 flex-1 pl-2 sm:pl-0">
          <p className="truncate text-sm font-semibold tracking-[-0.02em]">{product.title}</p>
          <p className="text-xs text-black/60">{comingSoon ? "Precio previsto · " : ""}{priceLabel ?? "A confirmar"}</p>
        </div>
        {cta("dock")}
      </div>
    </article>
  );
}
