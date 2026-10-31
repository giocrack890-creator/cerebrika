import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { TrackProductEvent } from "@/components/analytics/meta-pixel";
import { BuyButton, CheckoutProvider } from "@/components/landing/checkout";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { PromptCard } from "@/components/landing/prompt-preview";
import { Container, FitLists, PlaceholderNotice, SectionHeading, TrustRow } from "@/components/landing/sections";
import { BookCover } from "@/components/store/book-cover";
import { ChapterList } from "@/components/store/chapter-list";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";
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

async function LiveHome() {
  // El precio sale de PRICE_ARS en cada request: un cambio en Vercel se ve sin volver a construir.
  await connection();
  const flagship = getFlagship();
  const price = resolvePriceArs(flagship);
  const priceLabel = price ? formatArs(price) : null;
  const placeholder = !flagship.manuscriptReady;
  const faq = fillFaq(priceLabel ?? "el que figura al pagar", getDownloadTtlHours());
  const testimonials = selectTestimonials(site.testimonials, process.env.NODE_ENV).filter((item) => !item.placeholder);
  const upcoming = products.filter((product) => product.status === "coming_soon").slice(0, 4);
  const previewPrompts = [prompts[0], prompts[2]].filter(Boolean);

  const buyLabel = (
    <>
      <span>{site.hero.cta}</span>
      {priceLabel ? <span className="font-normal opacity-80">· {priceLabel}</span> : null}
    </>
  );

  return (
    <CheckoutProvider
      productSlug={flagship.slug}
      productTitle={flagship.title}
      price={price}
      placeholderNotice={placeholder ? site.placeholderNotice : null}
    >
      <SiteHeader cta={<BuyButton className="btn btn-primary btn-sm">Comprar</BuyButton>} />

      <main id="contenido">
        {/* Hero */}
        <section className="overflow-hidden">
          <Container className="grid items-center gap-10 pt-6 pb-14 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-16 lg:pb-24">
            <div>
              <p className="rise-in inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {site.hero.kicker}
              </p>
              <h1 className="font-display mt-5 text-[clamp(2.6rem,11vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.045em]">
                {site.hero.title}
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted sm:text-[18px]">{site.hero.subtitle}</p>
              <div id="hero-cta" className="mt-8 flex flex-col gap-2 sm:flex-row">
                <BuyButton className="btn btn-primary h-14 w-full px-6 text-[16px] sm:w-auto">{buyLabel}</BuyButton>
                <a href="#adentro" className="btn btn-ghost h-14 w-full sm:w-auto">
                  {site.hero.secondary}
                </a>
              </div>
              <p className="mt-3 text-[13px] text-subtle">Pago único con Mercado Pago · El PDF llega a tu mail</p>
              {placeholder ? <PlaceholderNotice className="mt-4 max-w-md" /> : null}
            </div>
            <div className="relative">
              <div className="relative mx-auto flex aspect-square max-w-[480px] items-center justify-center rounded-[24px] bg-accent-soft">
                <div className="rise-in-2 w-[52%]">
                  <BookCover product={flagship} tilted />
                </div>
                <p className="absolute top-5 right-5 rounded-full bg-surface px-3 py-1.5 text-[13px] font-medium shadow-[0_0_0_1px_var(--accent-line)]">
                  {flagship.chapters.length} capítulos
                </p>
                <p className="absolute bottom-5 left-5 rounded-full bg-surface px-3 py-1.5 text-[13px] font-medium shadow-[0_0_0_1px_var(--accent-line)]">
                  PDF para leer en el celu
                </p>
              </div>
            </div>
          </Container>
          <Container className="pb-4 sm:pb-8">
            <TrustRow />
          </Container>
        </section>

        {/* Antes y después */}
        <section className="py-12 sm:py-24">
          <Container>
            <SectionHeading kicker={site.week.kicker} title={site.week.title} />
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              <div className="reveal rounded-[16px] p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-7">
                <p className="text-[13px] font-medium text-subtle">{site.week.beforeLabel}</p>
                <ul className="mt-4 space-y-4">
                  {site.week.before.map((item) => (
                    <li key={item} className="flex gap-3 text-[16px] leading-snug text-muted">
                      <CloseIcon className="mt-0.5 h-5 w-5 shrink-0 text-subtle" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reveal rounded-[16px] bg-accent p-5 text-white sm:p-7">
                <p className="text-[13px] font-medium text-white/70">{site.week.afterLabel}</p>
                <ul className="mt-4 space-y-4">
                  {site.week.after.map((item) => (
                    <li key={item} className="flex gap-3 text-[16px] leading-snug">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-line" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Beneficios */}
        <section className="bg-surface py-12 sm:py-24">
          <Container>
            <SectionHeading kicker={site.included.kicker} title={site.included.title} />
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {site.included.items.map((item, index) => (
                <div key={item.id} className="reveal border-t border-line pt-5">
                  <p className="font-display text-[15px] font-bold text-accent">0{index + 1}</p>
                  <h3 className="font-display mt-2 text-[22px] leading-tight font-bold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Cómo funciona */}
        <section className="py-12 sm:py-24">
          <Container>
            <SectionHeading kicker={site.how.kicker} title={site.how.title} />
            <ol className="mt-10 grid gap-3 md:grid-cols-3">
              {site.how.steps.map((step, index) => (
                <li key={step.id} className="reveal relative rounded-[16px] bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-6">
                  <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em]">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Preview de los pedidos */}
        <section className="py-12 sm:py-24">
          <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading kicker={site.preview.kicker} title={site.preview.title} body={site.preview.body} />
              <a
                href="#prompts"
                className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-accent underline-offset-4 hover:underline"
              >
                Recibir los 10 gratis
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
            <div className="grid gap-3">
              {previewPrompts.map((prompt) => (
                <PromptCard key={prompt.title} prompt={prompt} />
              ))}
            </div>
          </Container>
        </section>

        {/* Índice */}
        <section id="adentro" className="scroll-mt-20 bg-surface py-12 sm:py-24">
          <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading kicker={site.chapters.kicker} title={site.chapters.title} body={flagship.chaptersNote} />
              <div className="mt-8 hidden lg:block">
                <BuyButton className="btn btn-primary">{buyLabel}</BuyButton>
              </div>
            </div>
            <div className="reveal">
              <ChapterList chapters={flagship.chapters} />
              <div className="mt-8 lg:hidden">
                <BuyButton className="btn btn-primary w-full">{buyLabel}</BuyButton>
              </div>
            </div>
          </Container>
        </section>

        {/* Para quién */}
        <section className="py-12 sm:py-24">
          <Container>
            <SectionHeading kicker={site.audience.kicker} title="¿Es para vos?" />
            <div className="mt-10">
              <FitLists yes={flagship.forYou} no={flagship.notForYou} />
            </div>
          </Container>
        </section>

        {testimonials.length > 0 ? (
          <section className="py-12 sm:py-24">
            <Container>
              <SectionHeading kicker="Opiniones" title={site.testimonialsHeading} />
              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {testimonials.map((item) => (
                  <figure key={item.id} className="reveal rounded-[16px] bg-surface p-6 shadow-[inset_0_0_0_1px_var(--line)]">
                    <blockquote className="text-[16px] leading-relaxed">{item.quote}</blockquote>
                    <figcaption className="mt-4 text-[14px] text-muted">
                      {item.name} · {item.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {/* FAQ */}
        <section className="py-12 sm:py-24">
          <Container>
            <FaqList items={faq} />
          </Container>
        </section>

        {/* CTA final */}
        <section className="pb-12 sm:pb-24">
          <Container>
            <div className="reveal grid items-center gap-10 overflow-hidden rounded-[24px] bg-accent px-5 py-12 text-white sm:px-12 sm:py-16 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="text-[13px] font-medium text-white/70">{site.finalCta.kicker}</p>
                <h2 className="font-display mt-2 text-[clamp(2rem,7vw,3.25rem)] leading-[1] font-bold tracking-[-0.04em]">
                  {site.finalCta.title}
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">{site.finalCta.body}</p>
                <BuyButton className="btn btn-light mt-8 h-14 w-full px-6 text-[16px] sm:w-auto">{buyLabel}</BuyButton>
                {placeholder ? <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/70">{site.placeholderNotice}</p> : null}
              </div>
              <div className="mx-auto hidden w-[200px] lg:block">
                <BookCover product={flagship} tilted />
              </div>
            </div>
          </Container>
        </section>

        {/* Alternativa gratis */}
        <section className="pb-12 sm:pb-24">
          <Container>
            <LeadForm />
          </Container>
        </section>

        {/* Lo que viene */}
        {upcoming.length > 0 ? (
          <section className="border-t border-line py-12 sm:py-24">
            <Container>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading kicker={site.upcoming.kicker} title={site.upcoming.title} body={site.upcoming.body} />
                <Link href="/catalogo" className="btn btn-ghost btn-sm self-start sm:self-auto">
                  {site.upcoming.link}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="no-scrollbar -mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
                {upcoming.map((product) => (
                  <div key={product.slug} className="w-[200px] shrink-0 snap-start sm:w-auto">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        ) : null}
      </main>

      <StoreFooter />

      <StickyBuyBar watchId="hero-cta" title={flagship.cover.headline} detail={priceLabel ? `${priceLabel} · pago único` : "Pago único"}>
        <BuyButton className="btn btn-primary btn-sm">Comprar</BuyButton>
      </StickyBuyBar>
      {price ? (
        <TrackProductEvent event="ViewContent" items={[{ slug: flagship.slug, title: flagship.title, price }]} />
      ) : null}
    </CheckoutProvider>
  );
}
