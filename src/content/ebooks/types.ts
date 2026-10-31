/**
 * Texto completo de un ebook. Es la fuente del PDF que se entrega y del
 * capítulo gratis de la ficha. Sin imports con alias: el script de PDF lo
 * corre Node directo.
 *
 * Marcado del cuerpo (bloques separados por una línea en blanco):
 *   ### Subtítulo
 *   - ítem de lista
 *   1. paso numerado
 *   [ ] casilla de checklist
 *   > PROMPT: Título del pedido   (las líneas siguientes son el pedido)
 *   ! Nota destacada
 *   Cualquier otro bloque es un párrafo.
 */
export type ManuscriptChapter = {
  number: string;
  title: string;
  summary: string;
  body: string;
};

export type Manuscript = {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  intro: string;
  chapters: readonly ManuscriptChapter[];
  closing: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "check"; items: string[] }
  | { type: "prompt"; title: string; text: string }
  | { type: "tip"; text: string };
