import type { Chapter, Testimonial } from "@/content/site";
import { site } from "@/content/site";

export function Hero({
  priceLabel,
  showPlaceholder,
  pricePending = false,
}: {
  priceLabel: string | null;
  showPlaceholder: boolean;
  pricePending?: boolean;
}) {
  return (
    <section
      id="inicio"
      className="flex min-h-[100svh] scroll-mt-24 flex-col items-center justify-center px-6 pb-32 pt-28 text-center"
    >
      <p className="text-xs font-semibold tracking-[0.22em] uppercase">{site.hero.kicker}</p>
      <h1 className="mt-6 max-w-5xl text-[clamp(3.1rem,8.6vw,7.4rem)] font-bold leading-[0.88] tracking-[-0.055em]">
        {site.hero.title}
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">{site.hero.subtitle}</p>
      <p className="mt-6 min-h-5 text-sm font-medium tracking-tight">
        {pricePending
          ? "\u00a0"
          : priceLabel
            ? `${site.checkout.priceLabel} · ${priceLabel}`
            : site.checkout.missingPrice}
      </p>
      {showPlaceholder ? (
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-black/60">{site.placeholderNotice}</p>
      ) : null}
    </section>
  );
}

function Stars() {
  return (
    <p className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="m10 1.8 2.1 4.6 5 .6-3.7 3.4.9 5-4.3-2.4L5.7 15.4l.9-5L2.9 7l5-.6L10 1.8Z" />
        </svg>
      ))}
    </p>
  );
}

function ReviewCard({ item }: { item: Testimonial }) {
  return (
    <article
      className="flex w-[320px] shrink-0 flex-col rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(17,17,17,0.08)] sm:w-[360px]"
      aria-label={item.placeholder ? "Testimonio de ejemplo, no es una opinión real" : item.name}
    >
      <div className="flex items-start justify-between gap-3">
        <Stars />
        <span className="rounded-full bg-[#F5F2EB] px-3 py-1 text-[10px] font-semibold tracking-[0.14em]">
          {item.tag}
        </span>
      </div>
      <p className="mt-5 text-base leading-relaxed">{item.quote}</p>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F2EB] text-xs font-semibold">
          EJ
        </span>
        <span>
          <span className="block text-sm font-semibold">{item.name}</span>
          <span className="block text-xs text-black/60">{item.role}</span>
        </span>
      </div>
    </article>
  );
}

export function Testimonials({
  items,
  showDisclaimer,
}: {
  items: readonly Testimonial[];
  showDisclaimer: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section
      className="scroll-mt-24 py-24"
      aria-label={showDisclaimer ? "Maquetas de testimonios, no son opiniones reales" : "Opiniones de docentes"}
    >
      <h2 className="px-6 text-center text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em]">
        {site.testimonialsHeading}
      </h2>
      {showDisclaimer ? (
        <p className="mx-auto mt-4 max-w-xl px-6 text-center text-sm leading-relaxed text-black/60">
          {site.testimonialsDisclaimer}
        </p>
      ) : null}
      <div className="marquee mt-12 overflow-hidden">
        <div className="marquee-track flex w-max">
          <div className="marquee-set flex gap-4 pr-4">
            {items.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </div>
          <div className="marquee-clone flex gap-4 pr-4" aria-hidden="true">
            {items.map((item) => (
              <ReviewCard key={`${item.id}-clone`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Audience() {
  return (
    <section className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
      <div>
        <h2 className="text-4xl font-bold tracking-[-0.045em]">{site.audience.yesTitle}</h2>
        <ul className="mt-6 space-y-4 text-lg leading-relaxed">
          {site.audience.yes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-4xl font-bold tracking-[-0.045em]">{site.audience.noTitle}</h2>
        <ul className="mt-6 space-y-4 text-lg leading-relaxed text-black/70">
          {site.audience.no.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Chapters({ chapters }: { chapters: readonly Chapter[] }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-4xl font-bold tracking-[-0.045em]">{site.chaptersHeading}</h2>
      <p className="mt-3 text-sm text-black/60">{site.chaptersNote}</p>
      <ol className="mt-8 divide-y divide-black/10">
        {chapters.map((chapter) => (
          <li key={chapter.number} className="grid grid-cols-[auto_1fr] gap-4 py-5">
            <span className="pt-1 text-xs font-semibold tracking-[0.16em] text-black/45">{chapter.number}</span>
            <span>
              <span className="block text-xl font-semibold tracking-[-0.03em]">{chapter.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-black/60">{chapter.summary}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-6 pt-8 pb-36 text-sm leading-relaxed text-black/60">
      <p className="font-semibold text-black">{site.chrome.brand}</p>
      <p className="mt-2">{site.footer.line}</p>
      <p className="mt-4">{site.footer.seller}</p>
      <p>{site.footer.contact}</p>
      <p>{site.footer.tax}</p>
      <p className="mt-4">{site.footer.legal}</p>
    </footer>
  );
}
