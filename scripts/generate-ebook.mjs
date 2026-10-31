// Genera el PDF de un ebook a partir de su manuscrito en manuscripts/<slug>.ts.
// Uso: npm run ebook:pdf -- ia-para-docentes
// Node corre los .ts directo (type stripping), por eso los imports llevan extensión.
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const slug = process.argv[2] ?? "ia-para-docentes";
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug inválido.");
  process.exit(1);
}

const root = process.cwd();
const source = path.join(root, "manuscripts", `${slug}.ts`);
try {
  await access(source);
} catch {
  console.error(`No existe ${path.relative(root, source)}. Los manuscritos no están en git: copialo a manuscripts/.`);
  process.exit(1);
}

const exported = await import(pathToFileURL(source).href);
const manuscript = Object.values(exported).find((value) => value && typeof value === "object" && value.slug === slug);
if (!manuscript) {
  console.error(`El archivo no exporta un manuscrito con slug ${slug}.`);
  process.exit(1);
}

const { renderEbookPdf } = await import(pathToFileURL(path.join(root, "src/lib/ebook/render-pdf.ts")).href);
const { countWords, countPrompts } = await import(pathToFileURL(path.join(root, "src/lib/ebook/parse.ts")).href);
const { bytes, pages } = await renderEbookPdf(manuscript);
const outDir = path.join(root, "dist-ebooks");
await mkdir(outDir, { recursive: true });
const out = path.join(outDir, `${slug}.pdf`);
await writeFile(out, bytes);

console.log(`${path.relative(root, out)} · ${pages} páginas · ${countWords(manuscript)} palabras · ${countPrompts(manuscript)} pedidos`);
