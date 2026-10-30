import Link from "next/link";
import { site } from "@/content/site";

export function ResultScreen({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#F3EEE6] px-6 py-16">
      <div className="w-full max-w-xl rounded-[28px] border border-black/10 bg-[#FBF8F3] p-8 sm:p-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#6B4F3B] uppercase">{site.brand.name}</p>
        <h1 className="font-display mt-4 text-4xl tracking-[-0.03em]">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#5E564E]">{body}</p>
        <Link href="/" className="btn btn-primary mt-8 px-5 py-3 text-[15px]">
          {site.payments.back}
        </Link>
      </div>
    </main>
  );
}
