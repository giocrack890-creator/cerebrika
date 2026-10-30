import { site } from "@/content/site";

export function StoreFooter() {
  return (
    <footer className="mx-auto max-w-[1120px] px-4 pt-8 pb-16 text-sm leading-relaxed text-[#5E564E] sm:px-6">
      <p className="font-display text-2xl tracking-[-0.03em] text-[#1C1714]">{site.brand.name}</p>
      <p className="mt-3 max-w-xl">{site.footer.line}</p>
      <div className="mt-5 space-y-1">
        <p>{site.footer.seller}</p>
        <p>{site.footer.contact}</p>
        <p>{site.footer.tax}</p>
      </div>
      <p className="mt-4 max-w-xl">{site.footer.legal}</p>
    </footer>
  );
}
