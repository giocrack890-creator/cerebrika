import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { TrackProductEvent } from "@/components/analytics/meta-pixel";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { LeadForm } from "@/components/landing/lead-form";
import { PromptCard } from "@/components/landing/prompt-preview";
import { StoreFooter } from "@/components/store/footer";
import { CartButton } from "@/components/store/header";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { getFlagship, products, resolvePriceArs } from "@/content/products";
import { prompts } from "@/content/prompts";
import { fillFaq, selectTestimonials, site } from "@/content/site";
import { getDownloadTtlHours } from "@/lib/env";
import { formatArs } from "@/lib/format";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <LiveHome />
    </Suspense>
  );
}

/** Título de sección con emoji y número de página, como en un libro. */
function BookSection({
  page,
  emoji,
  title,
  id,
  children,
}: {
  page: number;
  emoji: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="book-col scroll-mt-6 pt-10 pb-6">
      <span className="page-mark" aria-hidden="true">
        {page}
      </span>
      <h2 className="book-h2 mt-2">
        <span aria-hidden="true">{emoji} </span>
        {title}
      </h2>
      <div className="book-text mt-5">{children}</div>
    </section>
  );
}

/** Separador de capítulo a todo el ancho. */
function ChapterBand({ emoji, title, id }: { emoji: string; title: string; id?: string }) {
  return (
    <div id={id} className="mt-10 bg-accent px-5 py-16 text-center text-white sm:py-24">
      <h2 className="font-display text-[clamp(2.2rem,10vw,3.5rem)] leading-none font-black tracking-[-0.04em]">
        <span aria-hidden="true">{emoji} </span>
        {title}
      </h2>
    </div>
  );
}

function EmojiList({ items, emoji, muted = false }: { items: readonly string[]; emoji: string; muted?: boolean }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li key={item} className={`flex gap-3 ${muted ? "text-muted" : ""}`}>
          <span aria-hidden="true">{emoji}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

async function LiveHome() {
  // El precio sale de PRICE_ARS en cada request: un cambio en Vercel se ve sin volver a construir.
  await connection();
  const flagship = getFlagship();
  const price = resolvePriceArs(flagship);
  const priceLabel = price ? formatArs(price) : null;
  const placeholder = !flagship.manuscriptReady;
  const faq = fillFaq(priceLabel ?? "el que figura al pagar", getDownloadTtlHours());
  const testimonials = selectTestimonials(site.testimonials, process.env.NODE_ENV).filter((item) => !item.placeholder);
  const upcoming = products.filter((product) => product.status === "coming_soon");
  const previewPrompts = [prompts[0], prompts[2]].filter(Boolean);
  const buyText = `Comprar el ebook${priceLabel ? ` — ${priceLabel}` : ""}`;
  let page = 0;
  const next = () => ++page;

  return (
    <CheckoutProvider
      productSlug={flagship.slug}
      productTitle={flagship.title}
      price={price}
      placeholderNotice={placeholder ? site.placeholderNotice : null}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-[12px] focus:bg-white focus:px-4 focus:py-2 focus:text-night"
      >
        Saltar al contenido
      </a>

      {/* Hero */}
      <header className="overflow-hidden bg-night text-white">
        <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
          <Link href="/" className="font-display text-[18px] font-black tracking-[-0.03em]">
            cerebrika
          </Link>
          <div className="ml-auto flex items-center gap-5 text-[14px] font-semibold text-white/75">
            <Link href="/catalogo" className="hover:text-white">
              Catálogo
            </Link>
            <Link href="/cuenta" className="hidden hover:text-white sm:inline">
              Mis compras
            </Link>
            <CartButton className="-mr-2 text-white hover:bg-white/10" />
          </div>
        </nav>
        <div className="mx-auto max-w-[760px] px-5 pt-10 pb-16 text-center sm:pt-16 sm:pb-24">
          <h1 className="font-display font-black uppercase">
            <span className="block text-[clamp(1.9rem,10vw,4.5rem)] leading-none tracking-[-0.03em]">IA para</span>
            <span className="block text-[clamp(3rem,16.5vw,10rem)] leading-[0.86] tracking-[-0.055em] text-accent-bright">
              docentes
            </span>
          </h1>
          <p className="font-display mt-5 text-[clamp(1.05rem,4.6vw,1.5rem)] font-extrabold tracking-[-0.01em] uppercase">
            Planificá tu semana en una hora
          </p>
          <p className="mx-auto mt-5 max-w-md text-[18px] leading-snug text-white/85 sm:text-[20px]">
            un ebook corto para <span className="hl">armar tus clases con un chat de IA</span>, sin jerga y sin instalar nada
          </p>
          <div id="hero-cta" className="mt-8">
            <BuyButton className="btn h-16 w-full max-w-md bg-accent-bright px-6 text-[19px] font-extrabold text-night hover:bg-white">
              {buyText}
            </BuyButton>
          </div>
          <p className="mt-5 text-[15px] font-bold">Pago único con Mercado Pago. El PDF llega a tu mail.</p>
          <Link href="/cuenta" className="hl mt-3 inline-block text-[15px] font-bold">
            ¿Ya lo compraste?
          </Link>
          {placeholder ? <p className="mx-auto mt-6 max-w-md text-[13px] leading-relaxed text-white/55">{site.placeholderNotice}</p> : null}
        </div>
      </header>

      <main id="contenido" className="pb-24">
        <BookSection page={next()} emoji="📕" title="Este libro">
          <p>{site.hero.subtitle}</p>
          <p>Es corto a propósito: lo leés en una tarde y lo usás el domingo, con tu materia y tu grupo. Esto es lo que trae:</p>
          <EmojiList items={site.offer.items} emoji="✅" />
          <p className="mt-6">
            <strong>{priceLabel ?? "Precio a confirmar"}</strong>. {site.offer.terms}
          </p>
        </BookSection>

        <BookSection page={next()} emoji="🙋" title="¿Es para vos?">
          <EmojiList items={flagship.forYou} emoji="✅" />
          <p className="mt-6 font-semibold">No es para vos si:</p>
          <EmojiList items={flagship.notForYou} emoji="❌" muted />
        </BookSection>

        <BookSection page={next()} emoji="⚡" title="TL;DR">
          <p>Si tenés poco tiempo, este es el resumen del libro. {site.method.body}</p>
          <ol className="mt-6 space-y-6">
            {site.method.steps.map((step, index) => (
              <li key={step.id}>
                <h3 className="book-h3">
                  {index + 1}. {step.title}
                  <span className="ml-2 align-middle text-[13px] font-semibold text-subtle">cap. {step.chapter}</span>
                </h3>
                <p className="mt-1">{step.body}</p>
              </li>
            ))}
          </ol>
        </BookSection>

        <BookSection page={next()} emoji="😮‍💨" title={site.week.title}>
          <p className="font-semibold">{site.week.beforeLabel}:</p>
          <EmojiList items={site.week.before} emoji="❌" muted />
          <p className="mt-6 font-semibold">{site.week.afterLabel}:</p>
          <EmojiList items={site.week.after} emoji="✅" />
        </BookSection>

        <ChapterBand emoji="📜" title="Índice" id="adentro" />
        <section className="book-col pt-10">
          <p className="book-text text-muted">{flagship.chaptersNote}</p>
          <ol className="mt-6 space-y-5">
            {flagship.chapters.map((chapter) => (
              <li key={chapter.number} className="book-text">
                <p className="font-bold">
                  {Number(chapter.number)}. {chapter.title}
                </p>
                <p className="text-muted">{chapter.summary}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <BuyButton className="btn btn-primary h-14 w-full text-[17px] font-extrabold">{buyText}</BuyButton>
          </div>
        </section>

        <BookSection page={next()} emoji="🔎" title={site.compare.title}>
          <p>{site.compare.body}</p>
          <p className="mt-6 font-semibold">❌ {site.compare.vagueLabel}:</p>
          <blockquote className="mt-2 border-l-4 border-line pl-4 text-muted italic">{site.compare.vague}</blockquote>
          <p className="mt-2 text-muted">{site.compare.vagueResult}</p>
          <p className="mt-6 font-semibold">✅ {site.compare.goodLabel}:</p>
          <blockquote className="mt-2 border-l-4 border-accent pl-4 italic">{site.compare.good}</blockquote>
          <p className="mt-2">{site.compare.goodResult}</p>
          <p className="mt-4 text-[14px] text-subtle">{site.compare.note}</p>
        </BookSection>

        <ChapterBand emoji="✍️" title="Muestra gratis" id="muestra" />
        <section className="book-col pt-10">
          <p className="book-text">{site.preview.body}</p>
          <div className="mt-6 grid gap-3">
            {previewPrompts.map((prompt) => (
              <PromptCard key={prompt.title} prompt={prompt} />
            ))}
          </div>
          <div className="mt-8">
            <LeadForm />
          </div>
        </section>

        {testimonials.length > 0 ? (
          <BookSection page={next()} emoji="💬" title={site.testimonialsHeading}>
            {testimonials.map((item) => (
              <blockquote key={item.id} className="mt-4 border-l-4 border-accent pl-4">
                <p>{item.quote}</p>
                <footer className="mt-1 text-[15px] text-muted">
                  {item.name} · {item.role}
                </footer>
              </blockquote>
            ))}
          </BookSection>
        ) : null}

        <BookSection page={next()} emoji="🛒" title="Comprar" id="comprar">
          <p>
            Un solo pago de <strong>{priceLabel ?? "precio a confirmar"}</strong> con Mercado Pago: tarjeta, débito o dinero en cuenta.
            Cuando el pago se aprueba, te llega el PDF al mail. Si después lo perdés, lo pedís de nuevo desde{" "}
            <Link href="/cuenta">Mis compras</Link>.
          </p>
          {site.guarantee.confirmed ? <p>{site.guarantee.body}</p> : null}
          <div className="mt-6">
            <BuyButton className="btn btn-primary h-14 w-full text-[17px] font-extrabold">{buyText}</BuyButton>
          </div>
          {placeholder ? <p className="mt-4 text-[14px] text-subtle">{site.placeholderNotice}</p> : null}
        </BookSection>

        <BookSection page={next()} emoji="❓" title={site.faqHeading} id="preguntas">
          <div className="space-y-6">
            {faq.map((item) => (
              <div key={item.q}>
                <h3 className="book-h3">{item.q}</h3>
                <p className="mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </BookSection>

        {upcoming.length > 0 ? (
          <BookSection page={next()} emoji="📚" title={site.upcoming.title}>
            <p>{site.upcoming.body}</p>
            <ul className="mt-4 space-y-2">
              {upcoming.map((product) => (
                <li key={product.slug}>
                  <Link href={`/productos/${product.slug}`}>{product.title}</Link>
                </li>
              ))}
            </ul>
          </BookSection>
        ) : null}
      </main>

      <StoreFooter />

      <StickyBuyBar watchId="hero-cta" title={flagship.cover.headline} detail="pago único, llega a tu mail">
        <BuyButton className="btn btn-light h-12 w-full font-extrabold sm:w-auto">{buyText}</BuyButton>
      </StickyBuyBar>
      {price ? (
        <TrackProductEvent event="ViewContent" items={[{ slug: flagship.slug, title: flagship.title, price }]} />
      ) : null}
    </CheckoutProvider>
  );
}
