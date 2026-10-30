import Link from "next/link";
import { catalogHref, categories, isCategoryId } from "@/content/products";
import { site } from "@/content/site";

export function StoreHeader({ q = "", categoria = "" }: { q?: string; categoria?: string }) {
  const active = isCategoryId(categoria) ? categoria : "";
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F3EEE6]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={site.brand.name}>
          <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1714] text-lg text-[#F3EEE6]">
            C
          </span>
          <span className="font-display text-lg tracking-[-0.03em]">{site.brand.name}</span>
        </Link>
        <form action="/" method="get" role="search" className="min-w-0 flex-1">
          {active ? <input type="hidden" name="categoria" value={active} /> : null}
          <label className="sr-only" htmlFor="catalogo-q">
            Buscar ebooks
          </label>
          <input
            id="catalogo-q"
            name="q"
            defaultValue={q}
            placeholder="Buscar ebooks"
            className="w-full rounded-full border border-black/10 bg-[#FBF8F3] px-4 py-2.5 text-sm outline-none placeholder:text-[#5E564E]"
          />
        </form>
      </div>
      <nav aria-label="Categorías" className="mx-auto flex max-w-[1120px] gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
        <Link
          href={catalogHref({ q })}
          aria-current={active ? undefined : "page"}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${active ? "text-[#5E564E] hover:bg-black/5" : "bg-[#1C1714] text-[#F6F1E8]"}`}
        >
          Todo
        </Link>
        {categories.map((category) => {
          const selected = active === category.id;
          return (
            <Link
              key={category.id}
              href={catalogHref({ categoria: category.id, q })}
              aria-current={selected ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${selected ? "bg-[#1C1714] text-[#F6F1E8]" : "text-[#1C1714] hover:bg-black/5"}`}
            >
              {category.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
