import { Container } from "@/components/landing/sections";
import { StoreFooter } from "@/components/store/footer";
import { SiteHeader } from "@/components/store/header";

/** Página de texto: contacto, quiénes somos y legales. */
export function TextPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="pb-12 sm:pb-24">
        <Container className="pt-8 sm:pt-14">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-accent">{kicker}</p>
            <h1 className="font-display mt-2 text-[clamp(2.4rem,9vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.045em]">{title}</h1>
            <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-muted [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-4">
              {children}
            </div>
          </div>
        </Container>
      </main>
      <StoreFooter />
    </>
  );
}
