import { site } from "@/content/site";

export function StoreFooter() {
  return (
    <footer className="mx-auto max-w-3xl px-3 pt-10 pb-8 text-sm leading-relaxed text-black/60">
      <p className="font-semibold text-black">{site.brand.name}</p>
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
