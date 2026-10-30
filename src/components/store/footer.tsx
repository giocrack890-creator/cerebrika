import Link from "next/link";
import { site } from "@/content/site";

const links = [
  ["Inicio", "/"],
  ["Catálogo", "/catalogo"],
  ["Carrito", "/carrito"],
  ["Mi cuenta", "/cuenta"],
  ["Quiénes somos", "/quienes-somos"],
  ["Contacto", "/contacto"],
  ["Términos", "/legal/terminos"],
  ["Privacidad", "/legal/privacidad"],
  ["Reembolsos", "/legal/reembolsos"],
] as const;

export function StoreFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-3 pt-12 pb-28 text-sm leading-relaxed text-black/60">
      <p className="text-sm font-bold tracking-[0.18em] text-black">
        CEREBRIKA<sup className="text-[9px]">TM</sup>
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="font-semibold tracking-[0.08em] text-black">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-xl">{site.footer.line}</p>
      <p className="mt-3">Mercado Pago: tarjeta, débito o dinero en cuenta.</p>
      <div className="mt-4 space-y-1">
        <p>{site.footer.seller}</p>
        <p>{site.footer.contact}</p>
        <p>{site.footer.tax}</p>
      </div>
      <p className="mt-4 max-w-xl">{site.footer.legal}</p>
    </footer>
  );
}
