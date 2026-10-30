import { Suspense } from "react";
import { connection } from "next/server";
import { CheckoutProvider } from "@/components/landing/checkout";
import { StackCards } from "@/components/landing/cards";
import { SiteChrome } from "@/components/landing/chrome";
import { FaqList } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { Audience, Chapters, Footer, Hero, Testimonials } from "@/components/landing/sections";
import { fillFaq, selectTestimonials, site } from "@/content/site";
import { getDownloadTtlHours, getEbookStorage, getPriceArs } from "@/lib/env";
import { formatArs } from "@/lib/format";

export default function HomePage() {
  return (
    <Suspense fallback={<Hero priceLabel={null} showPlaceholder={false} pricePending />}>
      <LiveHome />
    </Suspense>
  );
}

async function LiveHome() {
  await connection();
  const price = getPriceArs();
  const priceLabel = price ? formatArs(price) : null;
  const testimonials = selectTestimonials(site.testimonials, process.env.NODE_ENV);
  const showPlaceholder = !site.manuscriptReady || !getEbookStorage();

  return (
    <CheckoutProvider priceLabel={priceLabel}>
      <SiteChrome />
      <main>
        <Hero priceLabel={priceLabel} showPlaceholder={showPlaceholder} />
        <StackCards cards={site.cards} />
        <Testimonials
          items={testimonials}
          showDisclaimer={testimonials.some((item) => item.placeholder)}
        />
        <Audience />
        <Chapters chapters={site.chapters} />
        <LeadForm />
        <FaqList items={fillFaq(priceLabel ?? "a confirmar", getDownloadTtlHours())} />
        <Footer />
      </main>
    </CheckoutProvider>
  );
}
