import type { Block, Manuscript } from "../../content/ebooks/types.ts";

function joinLines(lines: string[]): string {
  return lines.map((line) => line.trim()).join(" ").replace(/\s+/g, " ").trim();
}

function listItems(lines: string[], marker: RegExp): string[] {
  const items: string[] = [];
  for (const line of lines) {
    const match = line.match(marker);
    if (match) items.push(line.slice(match[0].length).trim());
    else if (items.length > 0) items[items.length - 1] += ` ${line.trim()}`;
  }
  return items;
}

export function parseBlocks(source: string): Block[] {
  const chunks = source
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.split("\n").filter((line) => line.trim() !== ""))
    .filter((lines) => lines.length > 0);

  return chunks.map((lines): Block => {
    const first = lines[0].trim();
    if (first.startsWith("### ")) return { type: "h", text: first.slice(4).trim() };
    if (first.startsWith("> PROMPT:")) {
      return { type: "prompt", title: first.slice("> PROMPT:".length).trim(), text: joinLines(lines.slice(1)) };
    }
    if (first.startsWith("! ")) return { type: "tip", text: joinLines([first.slice(2), ...lines.slice(1)]) };
    if (first.startsWith("- ")) return { type: "ul", items: listItems(lines, /^\s*-\s+/) };
    if (first.startsWith("[ ] ")) return { type: "check", items: listItems(lines, /^\s*\[ \]\s+/) };
    if (/^\d+\.\s/.test(first)) return { type: "ol", items: listItems(lines, /^\s*\d+\.\s+/) };
    return { type: "p", text: joinLines(lines) };
  });
}

export function countWords(manuscript: Manuscript): number {
  const text = [manuscript.intro, ...manuscript.chapters.map((chapter) => chapter.body), manuscript.closing].join(" ");
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

export function countPrompts(manuscript: Manuscript): number {
  return [manuscript.intro, ...manuscript.chapters.map((chapter) => chapter.body), manuscript.closing]
    .flatMap((body) => parseBlocks(body))
    .filter((block) => block.type === "prompt").length;
}

export function firstPrompt(manuscript: Manuscript): { title: string; text: string } | null {
  for (const chapter of manuscript.chapters) {
    const block = parseBlocks(chapter.body).find((item) => item.type === "prompt");
    if (block && block.type === "prompt") return { title: block.title, text: block.text };
  }
  return null;
}
