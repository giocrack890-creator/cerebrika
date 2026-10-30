import { BuyButton } from "@/components/landing/checkout";
import type { StackCard } from "@/content/site";

const whitePill =
  "inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]";

function CardVisual({ kind }: { kind: StackCard["visual"] }) {
  if (kind === "chat") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-2 top-8 h-[86%] w-[92%] rotate-3 rounded-[28px] bg-white/25" />
        <div className="absolute right-6 top-14 flex h-[80%] w-[88%] -rotate-2 flex-col gap-3 rounded-[28px] bg-white p-5 text-[#111] shadow-2xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-black/40">BOCETO · CHAT</p>
          <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#F5F2EB] px-3 py-2 text-sm">
            Armame la clase de mañana.
          </p>
          <div className="ml-auto w-[84%] space-y-2 rounded-2xl rounded-br-md bg-[#111] p-3">
            <div className="h-2 rounded-full bg-white/70" />
            <div className="h-2 w-4/5 rounded-full bg-white/40" />
            <div className="h-2 w-3/5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "check") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-10 h-[78%] w-[88%] rotate-6 rounded-[28px] bg-white/25" />
        <div className="absolute right-8 top-16 h-[78%] w-[86%] -rotate-2 rounded-[28px] bg-white p-6 text-[#111] shadow-2xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-black/40">BOCETO · REVISIÓN</p>
          <ul className="mt-6 space-y-4">
            {["Dato chequeable", "Tono para tu grupo", "Entra en el módulo", "Se puede hacer sin internet"].map(
              (item, index) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      index === 0 ? "border-transparent bg-[#DC2626] text-white" : "border-black/20"
                    }`}
                  >
                    {index === 0 ? "✓" : ""}
                  </span>
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    );
  }

  if (kind === "week") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-4 top-8 h-[82%] w-[90%] rotate-2 rounded-[28px] bg-white/20" />
        <div className="absolute right-8 top-16 grid h-[74%] w-[86%] -rotate-3 grid-cols-5 gap-2 rounded-[28px] bg-white p-4 text-[#111] shadow-2xl">
          {["Lun", "Mar", "Mié", "Jue", "Vie"].map((day) => (
            <div key={day} className="flex flex-col rounded-2xl bg-[#F5F2EB] p-2">
              <span className="text-[10px] font-semibold tracking-wide">{day}</span>
              <span className="mt-3 h-10 rounded-xl bg-white" />
              <span className="mt-2 h-6 rounded-xl bg-white/70" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute right-0 top-6 h-[82%] w-[88%] rotate-[8deg] rounded-[28px] bg-white/25" />
      <div className="absolute right-8 top-16 h-[80%] w-[86%] -rotate-[4deg] rounded-[28px] bg-white p-6 text-[#111] shadow-2xl">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-black/40">BOCETO · PÁGINA</p>
        <p className="mt-4 text-2xl font-bold tracking-[-0.04em]">Semana en una hora</p>
        <div className="mt-6 space-y-3">
          <div className="h-2 rounded-full bg-black/10" />
          <div className="h-2 w-5/6 rounded-full bg-black/10" />
          <div className="h-2 w-2/3 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}

function CardButton({ card }: { card: StackCard }) {
  if (card.action === "prompts") {
    return (
      <a href="#prompts" className={whitePill}>
        {card.button}
      </a>
    );
  }
  return <BuyButton label={card.button} className={whitePill} />;
}

export function StackCards({ cards }: { cards: readonly StackCard[] }) {
  return (
    <section id="metodo" className="relative px-3 pb-8 sm:px-6 lg:px-10">
      {cards.map((card, index) => (
        <article
          key={card.id}
          className="stack-card relative sticky top-[4vh] mb-4 grid min-h-[88svh] grid-cols-1 items-center gap-6 overflow-hidden rounded-[32px] px-6 pt-20 pb-36 text-white motion-reduce:static motion-reduce:h-auto sm:px-10 md:px-16 md:pt-20 md:pb-32 lg:mb-6 lg:h-[86vh] lg:grid-cols-[1.35fr_0.9fr] lg:gap-10 lg:px-20 lg:pb-28"
          style={{ backgroundColor: card.color, zIndex: index + 1 }}
        >
          <p className="absolute right-6 top-16 text-sm font-medium tracking-[0.18em] text-white/80 lg:right-10 lg:top-8">
            {card.tag}
          </p>
          <div className="lg:col-start-1 lg:row-start-1">
            <h2 className="max-w-xl text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.05em]">
              {card.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 lg:text-lg">{card.body}</p>
          </div>
          <div className="relative min-h-[210px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[340px] lg:self-center">
            <CardVisual kind={card.visual} />
            <div className="absolute top-14 left-2 z-10 lg:top-20">
              <CardButton card={card} />
            </div>
          </div>
          <blockquote className="max-w-md rounded-[24px] bg-white/15 p-5 lg:col-start-1 lg:row-start-2">
            <p className="text-[11px] font-semibold tracking-[0.16em]">MANUSCRITO · PLACEHOLDER</p>
            <p className="mt-2 text-base leading-snug">{card.quote}</p>
          </blockquote>
        </article>
      ))}
    </section>
  );
}
