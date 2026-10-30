import { getPriceArs } from "@/lib/env";

export const categories = [
  {
    id: "docentes",
    label: "Docentes",
    blurb: "Planificar la clase y la semana.",
  },
  {
    id: "productividad",
    label: "Productividad",
    blurb: "Reuniones, tareas y la semana de trabajo.",
  },
  {
    id: "creatividad",
    label: "Creatividad",
    blurb: "Borradores, ideas y textos.",
  },
  {
    id: "estudiantes",
    label: "Estudiantes",
    blurb: "Estudiar un tema sin perder el hilo.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ProductStatus = "available" | "coming_soon";

export type Chapter = {
  number: string;
  title: string;
  summary: string;
};

export type CatalogProduct = {
  slug: string;
  title: string;
  promise: string;
  description: string;
  category: CategoryId;
  /** Precio de catálogo. En el destacado, PRICE_ARS lo pisa si está definido. */
  priceArs: number;
  status: ProductStatus;
  badge: "Destacado" | "Nuevo";
  fileName: string;
  /**
   * Ruta dentro del bucket. null en el destacado: se usa EBOOK_STORAGE_PATH.
   */
  storagePath: string | null;
  cover: { kicker: string; headline: string; line: string };
  chaptersNote: string;
  chapters: readonly Chapter[];
  forYou: readonly string[];
  notForYou: readonly string[];
  manuscriptReady: boolean;
};

export const FLAGSHIP_SLUG = "ia-para-docentes";

export const products = [
  {
    slug: FLAGSHIP_SLUG,
    title: "IA para docentes: planificá tu semana en 1 hora",
    promise: "Tu semana de clases, armada en una hora.",
    description:
      "Ebook corto, en castellano rioplatense, para pasar de la hoja en blanco a cinco días con inicio, desarrollo y cierre. Sin jerga y sin instalar nada.",
    category: "docentes",
    priceArs: 12000,
    status: "available",
    badge: "Destacado",
    fileName: "ia-para-docentes.pdf",
    storagePath: null,
    cover: {
      kicker: "Cerebrika",
      headline: "IA para docentes",
      line: "Planificá tu semana en 1 hora",
    },
    chaptersNote: "Índice en borrador. Los capítulos todavía no están redactados.",
    chapters: [
      {
        number: "01",
        title: "Para qué sirve la IA en el aula, y para qué no",
        summary: "Límites de la herramienta antes de usarla con un grupo.",
      },
      {
        number: "02",
        title: "Tu primera conversación con un chat",
        summary: "Cómo abrir, pedir y volver a pedir, sin jerga.",
      },
      {
        number: "03",
        title: "El dato que la IA no tiene: tu grupo",
        summary: "Qué tenés que contarle para que la idea sirva en tu curso.",
      },
      {
        number: "04",
        title: "De la planificación anual a la semana",
        summary: "Bajar un tema grande a cinco días.",
      },
      {
        number: "05",
        title: "Armar una clase que entra en el módulo",
        summary: "Inicio, desarrollo y cierre con tiempos.",
      },
      {
        number: "06",
        title: "Actividades para ritmos distintos",
        summary: "Variar una misma consigna sin armar dos clases.",
      },
      {
        number: "07",
        title: "Revisar lo que escribió la IA",
        summary: "Datos, tono y si se puede hacer de verdad.",
      },
      {
        number: "08",
        title: "Una rutina de una hora para toda la semana",
        summary: "El método, paso a paso, cuando el texto esté cerrado.",
      },
    ],
    forYou: [
      "Planificás clases y el domingo se te va en eso.",
      "Escuchaste de la IA y no sabés por dónde entrar.",
      "Querés algo corto para usar esta semana, no un curso largo.",
    ],
    notForYou: [
      "Buscás aprender a programar.",
      "Ya armás todo tu trabajo con IA y querés un nivel avanzado.",
      "Necesitás hoy el libro con el texto definitivo: el manuscrito sigue en preparación.",
    ],
    manuscriptReady: false,
  },
  {
    slug: "ia-para-estudiar",
    title: "IA para estudiar: un tema en 45 minutos",
    promise: "Estudiá un tema sin perder el hilo.",
    description:
      "Mini ebook para estudiantes: cómo pedirle a un chat que te explique, te pregunte y te arme un repaso. Todavía no está a la venta.",
    category: "estudiantes",
    priceArs: 9000,
    status: "coming_soon",
    badge: "Nuevo",
    fileName: "ia-para-estudiar.pdf",
    storagePath: "ia-para-estudiar.pdf",
    cover: {
      kicker: "Cerebrika",
      headline: "IA para estudiar",
      line: "Un tema en 45 minutos",
    },
    chaptersNote: "Todavía no está escrito. Esto es el recorte previsto, no el libro.",
    chapters: [
      { number: "01", title: "Qué pedirle y qué no", summary: "El chat no rinde el examen por vos." },
      { number: "02", title: "Explicar un tema en tus palabras", summary: "De la definición a un ejemplo propio." },
      { number: "03", title: "Un repaso de 45 minutos", summary: "Preguntas, huecos y un cierre." },
    ],
    forYou: ["Estudiás y el material se te hace una pared.", "Querés una rutina corta, no un curso de técnicas."],
    notForYou: ["Buscás que la IA haga el trabajo final.", "Ya tenés un método de estudio que te cierra."],
    manuscriptReady: false,
  },
  {
    slug: "ia-para-escribir",
    title: "IA para escribir: del blanco al borrador",
    promise: "Un borrador en una sentada, no una página perfecta.",
    description:
      "Mini ebook para salir de la hoja en blanco: idea, estructura y una primera versión para corregir. Todavía no está a la venta.",
    category: "creatividad",
    priceArs: 9000,
    status: "coming_soon",
    badge: "Nuevo",
    fileName: "ia-para-escribir.pdf",
    storagePath: "ia-para-escribir.pdf",
    cover: {
      kicker: "Cerebrika",
      headline: "IA para escribir",
      line: "Del blanco al borrador",
    },
    chaptersNote: "Todavía no está escrito. Esto es el recorte previsto, no el libro.",
    chapters: [
      { number: "01", title: "La idea en una frase", summary: "Antes de pedirle párrafos." },
      { number: "02", title: "Una estructura que se puede seguir", summary: "Inicio, nudos y cierre." },
      { number: "03", title: "Corregir lo que escribió la IA", summary: "Voz, datos y lo que sobra." },
    ],
    forYou: ["Escribís mails, textos o guiones y te trabás al empezar.", "Querés un borrador para editar, no un texto cerrado."],
    notForYou: ["Buscás un taller literario.", "Querés publicar sin leer lo que salió."],
    manuscriptReady: false,
  },
  {
    slug: "ia-para-reuniones",
    title: "IA para reuniones: salí con las tareas claras",
    promise: "De la nota suelta a las tareas, en el momento.",
    description:
      "Mini ebook para convertir una reunión en decisiones y próximos pasos. Todavía no está a la venta.",
    category: "productividad",
    priceArs: 9000,
    status: "coming_soon",
    badge: "Nuevo",
    fileName: "ia-para-reuniones.pdf",
    storagePath: "ia-para-reuniones.pdf",
    cover: {
      kicker: "Cerebrika",
      headline: "IA para reuniones",
      line: "Tareas claras al salir",
    },
    chaptersNote: "Todavía no está escrito. Esto es el recorte previsto, no el libro.",
    chapters: [
      { number: "01", title: "Qué anotar mientras hablan", summary: "Decisiones, dueños y fechas." },
      { number: "02", title: "El pedido para ordenar la nota", summary: "Sin inventar lo que nadie dijo." },
      { number: "03", title: "El mensaje de cierre", summary: "Un texto corto para mandar al equipo." },
    ],
    forYou: ["Salís de las reuniones con notas que no se pueden ejecutar.", "Querés un método corto, no otra app."],
    notForYou: ["Buscás un software de minutas.", "Facilitás reuniones como trabajo principal y querés un nivel avanzado."],
    manuscriptReady: false,
  },
  {
    slug: "ia-para-la-semana-laboral",
    title: "IA para la semana laboral: una hora y cinco días",
    promise: "La semana de trabajo, armada en una hora.",
    description:
      "Mini ebook para bajar prioridades, reuniones y huecos a cinco días. Todavía no está a la venta.",
    category: "productividad",
    priceArs: 9000,
    status: "coming_soon",
    badge: "Nuevo",
    fileName: "ia-para-la-semana-laboral.pdf",
    storagePath: "ia-para-la-semana-laboral.pdf",
    cover: {
      kicker: "Cerebrika",
      headline: "IA para la semana",
      line: "Cinco días en una hora",
    },
    chaptersNote: "Todavía no está escrito. Esto es el recorte previsto, no el libro.",
    chapters: [
      { number: "01", title: "Qué entra en la semana y qué no", summary: "Prioridades antes que el calendario." },
      { number: "02", title: "El pedido para armar los cinco días", summary: "Con tus límites reales, no un horario ideal." },
      { number: "03", title: "Revisar el plan", summary: "Huecos, choques y lo que depende de otra persona." },
    ],
    forYou: ["El lunes arranca sin un plan y el viernes se siente igual.", "Querés usar un chat para ordenar, no para hacer más."],
    notForYou: ["Buscás un sistema completo de productividad.", "Ya planificás la semana y solo querés atajos avanzados."],
    manuscriptReady: false,
  },
] as const satisfies readonly CatalogProduct[];

export type Product = (typeof products)[number];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFlagship(): Product {
  const product = getProduct(FLAGSHIP_SLUG);
  if (!product) throw new Error("Falta el ebook destacado.");
  return product;
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function categoryLabel(id: CategoryId): string {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function resolvePriceArs(product: Product): number | null {
  if (product.slug === FLAGSHIP_SLUG) {
    return getPriceArs() ?? (product.priceArs > 0 ? product.priceArs : null);
  }
  return product.priceArs > 0 ? product.priceArs : null;
}

export function isBuyable(product: Product): boolean {
  return product.status === "available" && resolvePriceArs(product) !== null;
}

export function catalogHref(input: { categoria?: string; q?: string } = {}): string {
  const params = new URLSearchParams();
  if (input.categoria) params.set("categoria", input.categoria);
  if (input.q) params.set("q", input.q);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function filterProducts(input: { categoria?: string; q?: string }): Product[] {
  const category = input.categoria && isCategoryId(input.categoria) ? input.categoria : undefined;
  const query = input.q?.trim().toLowerCase() ?? "";
  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!query) return true;
    const haystack = `${product.title} ${product.promise} ${product.description} ${categoryLabel(product.category)}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function relatedProducts(slug: string): Product[] {
  const current = getProduct(slug);
  if (!current) return [];
  const same = products.filter((product) => product.slug !== slug && product.category === current.category);
  const rest = products.filter((product) => product.slug !== slug && product.category !== current.category);
  return [...same, ...rest].slice(0, 3);
}

export function waitlistSource(slug: string): string | null {
  const product = getProduct(slug);
  if (!product || product.status !== "coming_soon") return null;
  const source = `aviso-${product.slug}`;
  return source.length <= 80 ? source : null;
}

export function parseLeadSource(raw: string | undefined): string | null {
  if (!raw || raw === "prompts-planificacion") return "prompts-planificacion";
  if (!raw.startsWith("aviso-")) return null;
  return waitlistSource(raw.slice("aviso-".length));
}

type PaymentMatch = {
  productId: string | null;
  externalReference: string | null;
};

export function resolvePaidProduct(payment: PaymentMatch): Product | null {
  const fromReference = payment.externalReference?.split(":")[0] ?? null;
  const candidates = [payment.productId, fromReference];
  for (const slug of candidates) {
    if (!slug) continue;
    const product = getProduct(slug);
    if (!product || product.status !== "available") continue;
    const matchesId = payment.productId === product.slug;
    const matchesReference = Boolean(payment.externalReference?.startsWith(`${product.slug}:`));
    if (matchesId || matchesReference) return product;
  }
  return null;
}
