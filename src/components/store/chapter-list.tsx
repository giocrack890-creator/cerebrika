import type { Chapter } from "@/content/products";

/** Índice completo, a la vista: en el celular un acordeón esconde lo que más vende. */
export function ChapterList({ chapters }: { chapters: readonly Chapter[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {chapters.map((chapter) => (
        <li key={chapter.number} className="grid grid-cols-[40px_1fr] gap-x-3 py-4 sm:grid-cols-[56px_1fr]">
          <span className="font-display pt-0.5 text-[15px] font-bold text-accent">{chapter.number}</span>
          <div>
            <p className="text-[16px] leading-snug font-medium">{chapter.title}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">{chapter.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
