import Link from "next/link";
import { Logo } from "@/components/store/header";
import { site } from "@/content/site";

export function ResultScreen({
  title,
  body,
  tone = "neutral",
  children,
  action,
}: {
  title: string;
  body: string;
  tone?: "neutral" | "success";
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <main id="contenido" className="flex min-h-[100svh] flex-col bg-paper px-5 py-6">
      <Logo />
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="rise-in w-full max-w-md">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${tone === "success" ? "bg-accent text-white" : "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]"}`}
            aria-hidden="true"
          >
            {tone === "success" ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <span className="font-display text-[20px] font-bold">c</span>
            )}
          </span>
          <h1 className="font-display mt-6 text-[clamp(2rem,7vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">{title}</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{body}</p>
          {children}
          <div className="mt-8 flex flex-wrap gap-2">
            {action}
            <Link href="/" className={action ? "btn btn-ghost" : "btn btn-ink"}>
              {site.payments.back}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
