const items = [
  { title: "Pago seguro con Mercado Pago", body: "El cobro se hace en Mercado Pago. No guardamos la tarjeta." },
  { title: "Entrega por email", body: "El enlace del PDF sale cuando el pago queda aprobado." },
  { title: "Un solo pago", body: "Sin suscripción ni renovación." },
];

export function TrustStrip() {
  return (
    <section aria-label="Confianza" className="border-y border-black/10 bg-[#FBF8F3]/70">
      <ul className="mx-auto grid max-w-[1120px] gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6">
        {items.map((item) => (
          <li key={item.title}>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-snug text-[#5E564E]">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
