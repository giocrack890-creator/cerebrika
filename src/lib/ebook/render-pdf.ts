import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import type { Block, Manuscript } from "../../content/ebooks/types.ts";
import { parseBlocks } from "./parse.ts";

/** A5: se lee bien en el celular y se imprime en una hoja doblada. */
const WIDTH = 419.53;
const HEIGHT = 595.28;
const MARGIN = 44;
const TOP = HEIGHT - 58;
const BOTTOM = 52;
const CONTENT = WIDTH - MARGIN * 2;

const INK = rgb(0.08, 0.075, 0.11);
const MUTED = rgb(0.42, 0.41, 0.46);
const PAPER = rgb(0.985, 0.976, 0.957);

export type RenderOptions = {
  /** Mail de quien compró. Va en cada página. */
  licensee?: string;
  orderRef?: string;
  issuedAt?: Date;
};

type Fonts = { body: PDFFont; bodyBold: PDFFont; bodyItalic: PDFFont; sans: PDFFont; sansBold: PDFFont };

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.replace(/./g, "$&$&") : clean, 16);
  return rgb(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
}

function tint(color: RGB, amount: number): RGB {
  return rgb(
    color.red + (1 - color.red) * amount,
    color.green + (1 - color.green) * amount,
    color.blue + (1 - color.blue) * amount,
  );
}

const replacements: Record<string, string> = { "→": "->", "←": "<-", "✓": "v", "≈": "~", "≤": "<=", "≥": ">=", " ": " " };
const encodable = new WeakMap<PDFFont, Map<string, boolean>>();

/** Las fuentes estándar usan WinAnsi: tildes, ñ, ¿ y comillas sí; flechas y emojis no. */
function clean(font: PDFFont, text: string): string {
  let cache = encodable.get(font);
  if (!cache) {
    cache = new Map();
    encodable.set(font, cache);
  }
  let out = "";
  for (const raw of text) {
    const char = replacements[raw] ?? raw;
    if (char.length > 1) {
      out += char;
      continue;
    }
    let ok = cache.get(char);
    if (ok === undefined) {
      try {
        font.widthOfTextAtSize(char, 10);
        ok = true;
      } catch {
        ok = false;
      }
      cache.set(char, ok);
    }
    out += ok ? char : "?";
  }
  return out;
}

function wrap(font: PDFFont, text: string, size: number, width: number): string[] {
  const words = clean(font, text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class Writer {
  page!: PDFPage;
  y = TOP;
  readonly contentPages: PDFPage[] = [];
  readonly openers = new Set<PDFPage>();

  // Campos explícitos: Node corre este archivo sin transpilar y no acepta parameter properties.
  readonly doc: PDFDocument;
  readonly fonts: Fonts;
  readonly accent: RGB;

  constructor(doc: PDFDocument, fonts: Fonts, accent: RGB) {
    this.doc = doc;
    this.fonts = fonts;
    this.accent = accent;
  }

  newPage() {
    this.page = this.doc.addPage([WIDTH, HEIGHT]);
    this.page.drawRectangle({ x: 0, y: 0, width: WIDTH, height: HEIGHT, color: PAPER });
    this.contentPages.push(this.page);
    this.y = TOP;
  }

  ensure(height: number) {
    if (this.y - height < BOTTOM) this.newPage();
  }

  text(lines: string[], font: PDFFont, size: number, leading: number, color: RGB = INK, x = MARGIN) {
    for (const line of lines) {
      this.ensure(leading);
      this.page.drawText(line, { x, y: this.y - size, size, font, color });
      this.y -= leading;
    }
  }

  paragraph(text: string) {
    const lines = wrap(this.fonts.body, text, 11, CONTENT);
    if (lines.length <= 3) this.ensure(lines.length * 16);
    else this.ensure(32);
    this.text(lines, this.fonts.body, 11, 16);
    this.y -= 8;
  }

  heading(text: string) {
    const lines = wrap(this.fonts.sansBold, text, 12.5, CONTENT);
    this.ensure(lines.length * 17 + 40);
    this.y -= 6;
    this.text(lines, this.fonts.sansBold, 12.5, 17);
    this.y -= 4;
  }

  list(items: string[], marker: (index: number) => string, box = false) {
    const indent = 18;
    items.forEach((item, index) => {
      const lines = wrap(this.fonts.body, item, 11, CONTENT - indent);
      this.ensure(Math.min(lines.length, 2) * 16);
      if (box) {
        this.page.drawRectangle({
          x: MARGIN + 1,
          y: this.y - 11,
          width: 8.5,
          height: 8.5,
          borderColor: this.accent,
          borderWidth: 1,
        });
      } else {
        this.page.drawText(clean(this.fonts.sansBold, marker(index)), {
          x: MARGIN,
          y: this.y - 11,
          size: 10,
          font: this.fonts.sansBold,
          color: this.accent,
        });
      }
      this.text(lines, this.fonts.body, 11, 16, INK, MARGIN + indent);
      this.y -= 3;
    });
    this.y -= 6;
  }

  boxed(label: string, text: string, font: PDFFont, fill: RGB) {
    const pad = 11;
    const size = font === this.fonts.bodyItalic ? 11 : 10;
    const leading = size + 4.5;
    const lines = wrap(font, text, size, CONTENT - pad * 2 - 4);
    let remaining = lines;
    let first = true;
    while (remaining.length > 0) {
      const head = first ? 18 : 0;
      const room = Math.floor((this.y - BOTTOM - pad * 2 - head) / leading);
      if (room < Math.min(3, remaining.length)) {
        this.newPage();
        continue;
      }
      const chunk = remaining.slice(0, room);
      remaining = remaining.slice(room);
      const height = pad * 2 + head + chunk.length * leading;
      const top = this.y;
      this.page.drawRectangle({ x: MARGIN, y: top - height, width: CONTENT, height, color: fill });
      this.page.drawRectangle({ x: MARGIN, y: top - height, width: 3, height, color: this.accent });
      let y = top - pad;
      if (first) {
        this.page.drawText(clean(this.fonts.sansBold, label.toUpperCase()), {
          x: MARGIN + pad + 4,
          y: y - 8,
          size: 8,
          font: this.fonts.sansBold,
          color: this.accent,
        });
        y -= head;
      }
      for (const line of chunk) {
        this.page.drawText(line, { x: MARGIN + pad + 4, y: y - size, size, font, color: INK });
        y -= leading;
      }
      this.y = top - height - 12;
      first = false;
    }
  }

  blocks(blocks: Block[]) {
    for (const block of blocks) {
      if (block.type === "p") this.paragraph(block.text);
      else if (block.type === "h") this.heading(block.text);
      else if (block.type === "ul") this.list(block.items, () => "•");
      else if (block.type === "ol") this.list(block.items, (index) => `${index + 1}.`);
      else if (block.type === "check") this.list(block.items, () => "", true);
      else if (block.type === "prompt") this.boxed(`Pedido para copiar · ${block.title}`, block.text, this.fonts.sans, tint(this.accent, 0.9));
      else this.boxed("Ojo", block.text, this.fonts.bodyItalic, rgb(0.97, 0.95, 0.88));
    }
  }

  sectionOpener(kicker: string, title: string, summary?: string) {
    this.newPage();
    this.openers.add(this.page);
    const titleLines = wrap(this.fonts.sansBold, title, 21, CONTENT);
    const band = 92 + titleLines.length * 25;
    this.page.drawRectangle({ x: 0, y: HEIGHT - band, width: WIDTH, height: band, color: this.accent });
    this.page.drawText(clean(this.fonts.sansBold, kicker.toUpperCase()), {
      x: MARGIN,
      y: HEIGHT - 58,
      size: 9,
      font: this.fonts.sansBold,
      color: rgb(1, 1, 1),
    });
    let y = HEIGHT - 92;
    for (const line of titleLines) {
      this.page.drawText(line, { x: MARGIN, y, size: 21, font: this.fonts.sansBold, color: rgb(1, 1, 1) });
      y -= 25;
    }
    this.y = HEIGHT - band - 28;
    if (summary) {
      this.text(wrap(this.fonts.bodyItalic, summary, 12, CONTENT), this.fonts.bodyItalic, 12, 17, MUTED);
      this.y -= 12;
    }
  }
}

function drawCover(doc: PDFDocument, fonts: Fonts, manuscript: Manuscript, accent: RGB) {
  const page = doc.addPage([WIDTH, HEIGHT]);
  page.drawRectangle({ x: 0, y: 0, width: WIDTH, height: HEIGHT, color: accent });
  page.drawRectangle({ x: 22, y: 22, width: WIDTH - 44, height: HEIGHT - 44, borderColor: rgb(1, 1, 1), borderWidth: 0.8, opacity: 0, borderOpacity: 0.55 });
  page.drawText("CEREBRIKA", { x: MARGIN, y: HEIGHT - 64, size: 10, font: fonts.sansBold, color: rgb(1, 1, 1) });
  page.drawText("EBOOK", { x: WIDTH - MARGIN - fonts.sansBold.widthOfTextAtSize("EBOOK", 10), y: HEIGHT - 64, size: 10, font: fonts.sansBold, color: rgb(1, 1, 1) });
  const titleLines = wrap(fonts.sansBold, manuscript.title, 30, CONTENT);
  let y = 300 + titleLines.length * 34;
  for (const line of titleLines) {
    page.drawText(line, { x: MARGIN, y, size: 30, font: fonts.sansBold, color: rgb(1, 1, 1) });
    y -= 34;
  }
  y -= 10;
  for (const line of wrap(fonts.bodyItalic, manuscript.subtitle, 15, CONTENT)) {
    page.drawText(line, { x: MARGIN, y, size: 15, font: fonts.bodyItalic, color: rgb(1, 1, 1), opacity: 0.88 });
    y -= 20;
  }
  page.drawText(clean(fonts.sans, "Ebooks cortos para usar la IA en un trabajo concreto"), {
    x: MARGIN,
    y: 62,
    size: 9,
    font: fonts.sans,
    color: rgb(1, 1, 1),
    opacity: 0.8,
  });
}

function drawLicense(doc: PDFDocument, fonts: Fonts, manuscript: Manuscript, options: RenderOptions, accent: RGB) {
  const page = doc.addPage([WIDTH, HEIGHT]);
  page.drawRectangle({ x: 0, y: 0, width: WIDTH, height: HEIGHT, color: PAPER });
  let y = HEIGHT - 90;
  const line = (text: string, font: PDFFont, size: number, color: RGB = INK, gap = size + 6) => {
    for (const part of wrap(font, text, size, CONTENT)) {
      page.drawText(part, { x: MARGIN, y, size, font, color });
      y -= gap;
    }
  };
  line(manuscript.title, fonts.sansBold, 14);
  y -= 8;
  line("© Cerebrika. Todos los derechos reservados.", fonts.body, 10, MUTED);
  y -= 18;
  page.drawRectangle({ x: MARGIN, y: y - 86, width: CONTENT, height: 96, color: tint(accent, 0.9) });
  y -= 10;
  const inner = (text: string, font: PDFFont, size: number) => {
    page.drawText(clean(font, text), { x: MARGIN + 14, y: y - size, size, font, color: INK });
    y -= size + 8;
  };
  inner("LICENCIA PERSONAL", fonts.sansBold, 9);
  inner(options.licensee ? `Para: ${options.licensee}` : "Copia de muestra, sin comprador asignado", fonts.sans, 10.5);
  if (options.orderRef) inner(`Pedido: ${options.orderRef}`, fonts.sans, 10.5);
  inner(`Emitido: ${(options.issuedAt ?? new Date()).toISOString().slice(0, 10)}`, fonts.sans, 10.5);
  y = Math.min(y, HEIGHT - 260) - 20;
  line(
    "Este PDF es para tu uso personal. Podés imprimirlo y leerlo en todos tus dispositivos. No lo subas a internet ni lo reenvíes: cada copia lleva el mail de quien la compró.",
    fonts.body,
    10.5,
    INK,
    15,
  );
  y -= 14;
  line(
    "Los pedidos para copiar funcionan en cualquier chat de IA general (ChatGPT, Gemini, Claude, Copilot u otro). Lo que entrega un chat cambia de una vez a otra: revisalo siempre antes de usarlo.",
    fonts.body,
    10.5,
    MUTED,
    15,
  );
}

function decorate(writer: Writer, fonts: Fonts, manuscript: Manuscript, options: RenderOptions, firstNumber: number) {
  const footer = options.licensee ? `Licencia personal · ${options.licensee}` : "Cerebrika";
  writer.contentPages.forEach((page, index) => {
    const number = String(firstNumber + index);
    page.drawText(number, {
      x: WIDTH - MARGIN - fonts.sans.widthOfTextAtSize(number, 8.5),
      y: 26,
      size: 8.5,
      font: fonts.sans,
      color: MUTED,
    });
    page.drawText(clean(fonts.sans, footer).slice(0, 80), { x: MARGIN, y: 26, size: 7.5, font: fonts.sans, color: MUTED });
    if (!writer.openers.has(page)) {
      page.drawText(clean(fonts.sans, manuscript.title.toUpperCase()).slice(0, 70), {
        x: MARGIN,
        y: HEIGHT - 30,
        size: 6.5,
        font: fonts.sans,
        color: MUTED,
      });
    }
  });
}

export async function renderEbookPdf(manuscript: Manuscript, options: RenderOptions = {}) {
  const doc = await PDFDocument.create();
  doc.setTitle(manuscript.title);
  doc.setAuthor("Cerebrika");
  doc.setSubject(manuscript.subtitle);
  doc.setProducer("Cerebrika");
  doc.setCreator("Cerebrika");
  doc.setLanguage("es-AR");
  if (options.licensee) doc.setKeywords([`licencia:${options.licensee}`]);
  const fonts: Fonts = {
    body: await doc.embedFont(StandardFonts.TimesRoman),
    bodyBold: await doc.embedFont(StandardFonts.TimesRomanBold),
    bodyItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
    sans: await doc.embedFont(StandardFonts.Helvetica),
    sansBold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  const accent = hexToRgb(manuscript.color);

  drawCover(doc, fonts, manuscript, accent);
  drawLicense(doc, fonts, manuscript, options, accent);

  const writer = new Writer(doc, fonts, accent);
  const toc: { label: string; title: string; page: number }[] = [];
  const frontPages = 3; // tapa, licencia, índice

  writer.sectionOpener("Antes de empezar", "Cómo usar este ebook");
  toc.push({ label: "", title: "Cómo usar este ebook", page: frontPages + writer.contentPages.length });
  writer.blocks(parseBlocks(manuscript.intro));

  for (const chapter of manuscript.chapters) {
    writer.sectionOpener(`Capítulo ${chapter.number}`, chapter.title, chapter.summary);
    toc.push({ label: chapter.number, title: chapter.title, page: frontPages + writer.contentPages.length });
    writer.blocks(parseBlocks(chapter.body));
  }

  writer.sectionOpener("Para cerrar", "Lo que te llevás");
  toc.push({ label: "", title: "Lo que te llevás", page: frontPages + writer.contentPages.length });
  writer.blocks(parseBlocks(manuscript.closing));
  writer.y -= 18;
  writer.ensure(60);
  writer.text(
    wrap(fonts.sansBold, "Más ebooks cortos en Cerebrika.", 11, CONTENT),
    fonts.sansBold,
    11,
    16,
    accent,
  );

  decorate(writer, fonts, manuscript, options, frontPages + 1);

  const tocPage = doc.insertPage(2, [WIDTH, HEIGHT]);
  tocPage.drawRectangle({ x: 0, y: 0, width: WIDTH, height: HEIGHT, color: PAPER });
  tocPage.drawText("ÍNDICE", { x: MARGIN, y: HEIGHT - 80, size: 9, font: fonts.sansBold, color: accent });
  let y = HEIGHT - 116;
  for (const entry of toc) {
    const titleLines = wrap(fonts.body, entry.title, 12, CONTENT - 64);
    if (entry.label) {
      tocPage.drawText(entry.label, { x: MARGIN, y, size: 10, font: fonts.sansBold, color: accent });
    }
    titleLines.forEach((line, index) => {
      tocPage.drawText(line, { x: MARGIN + 28, y: y - index * 15, size: 12, font: fonts.body, color: INK });
    });
    const pageLabel = String(entry.page);
    tocPage.drawText(pageLabel, {
      x: WIDTH - MARGIN - fonts.sans.widthOfTextAtSize(pageLabel, 10),
      y,
      size: 10,
      font: fonts.sans,
      color: MUTED,
    });
    y -= titleLines.length * 15 + 13;
  }

  const bytes = await doc.save();
  return { bytes, pages: doc.getPageCount() };
}
