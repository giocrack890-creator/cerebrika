import Link from "next/link";
import { site } from "@/content/site";

export function ResultScreen({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#F5F2EB] px-6 py-16">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(17,17,17,0.06)] sm:p-12">
        <p className="text-xs font-semibold tracking-[0.18em]">{site.hero.kicker}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em]">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-black/70">{body}</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white"
        >
          {site.payments.back}
        </Link>
      </div>
    </main>
  );
}
