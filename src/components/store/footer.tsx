import Link from "next/link";
import { Logo } from "@/components/store/header";
import { isPlaceholder, site } from "@/content/site";

const columns = [
  {
    title: "Tienda",
    links: [
      ["Inicio", "/"],
      ["Catálogo", "/catalogo"],
      ["Carrito", "/carrito"],
      ["Mis compras", "/cuenta"],
    ],
  },
  {
    title: "Cerebrika",
    links: [
      ["Quiénes somos", "/quienes-somos"],
      ["Contacto", "/contacto"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Términos", "/legal/terminos"],
      ["Privacidad", "/legal/privacidad"],
      ["Reembolsos", "/legal/reembolsos"],
    ],
  },
] as const;

export function StoreFooter() {
  // Los datos de quien vende se muestran solo cuando están completos en site.ts.
  const seller = [site.footer.seller, site.footer.contact, site.footer.tax].filter((value) => !isPlaceholder(value));

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-32 sm:px-8 lg:pb-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">{site.footer.line}</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[13px] font-medium text-subtle">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-[14px] text-ink transition-colors hover:text-accent">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>Pagos con Mercado Pago. Precios en pesos argentinos.</p>
          {seller.length > 0 ? <p>{seller.join(" · ")}</p> : null}
        </div>
      </div>
    </footer>
  );
}
