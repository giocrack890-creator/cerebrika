import { CardIcon, CheckIcon, CloseIcon, MailIcon, RepeatIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  kicker,
  title,
  body,
  align = "left",
  id,
}: {
  kicker: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={`reveal ${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      <p className="text-[13px] font-medium text-accent">{kicker}</p>
      <h2 id={id} className="font-display mt-2 text-[clamp(1.9rem,6vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">
        {title}
      </h2>
      {body ? <p className="mt-3 text-[16px] leading-relaxed text-muted">{body}</p> : null}
    </div>
  );
}

const trustIcons = { pago: CardIcon, mail: MailIcon, cuenta: RepeatIcon } as const;

/** Tres garantías operativas, no promesas: así funciona el cobro y la entrega. */
export function TrustRow() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[16px] bg-line shadow-[0_0_0_1px_var(--line)] sm:grid-cols-3">
      {site.trust.map((item) => {
        const Icon = trustIcons[item.id];
        return (
          <li key={item.id} className="flex gap-3 bg-surface p-4 sm:p-5">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-[15px] font-medium">{item.title}</p>
              <p className="mt-0.5 text-[14px] leading-snug text-muted">{item.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function FitLists({ yes, no }: { yes: readonly string[]; no: readonly string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="reveal rounded-[16px] bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-6">
        <p className="font-display text-[20px] font-bold tracking-[-0.02em]">{site.audience.yesTitle}</p>
        <ul className="mt-4 space-y-3">
          {yes.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-snug">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="reveal rounded-[16px] p-5 shadow-[inset_0_0_0_1px_var(--line)] sm:p-6">
        <p className="font-display text-[20px] font-bold tracking-[-0.02em]">{site.audience.noTitle}</p>
        <ul className="mt-4 space-y-3">
          {no.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-snug text-muted">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-line text-muted">
                <CloseIcon className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Aviso honesto junto al botón mientras el PDF real no esté publicado. */
export function PlaceholderNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`flex gap-2 text-[13px] leading-relaxed text-muted ${className}`}>
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      {site.placeholderNotice}
    </p>
  );
}
