import { getPriceArs } from "@/lib/env";

/**
 * Campos que el usuario completa cuando sean reales. Vacío o null = no se muestra.
 * - storeConfig.announcement: franja superior.
 * - compareAtArs: precio tachado, solo si es mayor al precio de venta.
 * - promoSavingsArs: "Precio de lanzamiento · Ahorrás $X". No se calcula solo.
 * - rating / soldCount: reseñas y "vendidos". Sin número, no hay widget.
 * WhatsApp: variable WHATSAPP_NUMBER (solo dígitos, con código de país).
 */
export const storeConfig = {
  announcement: "",
} as const;

export const categories = [
  { id: "docentes", label: "Docentes", blurb: "La clase y la semana." },
  { id: "productividad", label: "Productividad", blurb: "Reuniones, mails y la semana." },
  { id: "estudiantes", label: "Estudiantes", blurb: "Estudiar sin perder el hilo." },
  { id: "creatividad", label: "Creatividad", blurb: "Borradores y cuentos." },
  { id: "trabajo", label: "Trabajo", blurb: "CV y entrevistas." },
  { id: "vida-diaria", label: "Vida diaria", blurb: "Comida, casa y viajes." },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type CoverLayout = "frame" | "band" | "split" | "stack";
/** Tonos de tapa dentro de la paleta de marca. */
export type CoverTone = "violet" | "lavender" | "ink" | "paper" | "deep";

export type Chapter = { number: string; title: string; summary: string };

export type CatalogProduct = {
  slug: string;
  title: string;
  promise: string;
  description: string;
  category: CategoryId;
  priceArs: number;
  /** Precio tachado. null = no se muestra. */
  compareAtArs: number | null;
  /** Ahorro del banner de lanzamiento, en pesos. null = no se muestra. */
  promoSavingsArs: number | null;
  /** null = no hay reseñas reales. */
  rating: { score: number; count: number } | null;
  /** null = no mostramos "vendidos". */
  soldCount: number | null;
  status: "available" | "coming_soon";
  badge: "Destacado" | "Nuevo";
  fileName: string;
  storagePath: string | null;
  pages: number;
  minutes: number;
  outcomes: readonly string[];
  pairsWith: string | null;
  cover: { kicker: string; headline: string; line: string; tone: CoverTone; layout: CoverLayout };
  chaptersNote: string;
  chapters: readonly Chapter[];
  forYou: readonly string[];
  notForYou: readonly string[];
  manuscriptReady: boolean;
};

const planned = "Todavía no está escrito. Esto es el recorte previsto, no el libro.";

function soon(input: {
  slug: string;
  title: string;
  promise: string;
  description: string;
  category: CategoryId;
  priceArs: number;
  pages: number;
  minutes: number;
  tone: CoverTone;
  layout: CoverLayout;
  headline: string;
  line: string;
  outcomes: readonly string[];
  chapters: readonly Chapter[];
  forYou: readonly string[];
  notForYou: readonly string[];
  pairsWith: string | null;
}): CatalogProduct {
  return {
    ...input,
    status: "coming_soon",
    badge: "Nuevo",
    compareAtArs: null,
    promoSavingsArs: null,
    rating: null,
    soldCount: null,
    fileName: `${input.slug}.pdf`,
    storagePath: `${input.slug}.pdf`,
    chaptersNote: planned,
    manuscriptReady: false,
    cover: {
      kicker: "Cerebrika",
      headline: input.headline,
      line: input.line,
      tone: input.tone,
      layout: input.layout,
    },
  };
}

export const FLAGSHIP_SLUG = "ia-para-docentes";

export const products: readonly CatalogProduct[] = [
  {
    slug: FLAGSHIP_SLUG,
    title: "IA para docentes: planificá tu semana en 1 hora",
    promise: "Tu semana de clases, armada en una hora.",
    description:
      "Ebook corto, en castellano rioplatense, para pasar de la hoja en blanco a cinco días con inicio, desarrollo y cierre. Sin jerga y sin instalar nada.",
    category: "docentes",
    priceArs: 12000,
    compareAtArs: null,
    promoSavingsArs: null,
    rating: null,
    soldCount: null,
    status: "available",
    badge: "Destacado",
    fileName: "ia-para-docentes.pdf",
    storagePath: null,
    pages: 30,
    minutes: 40,
    outcomes: [
      "Bajar la semana a cinco días con inicio, desarrollo y cierre.",
      "Pedirle a un chat una clase en castellano, sin jerga.",
      "Revisar lo que escribió la IA antes de llevarlo al aula.",
    ],
    pairsWith: "ia-para-devolver-trabajos",
    cover: {
      kicker: "Cerebrika",
      headline: "IA para docentes",
      line: "Planificá tu semana en 1 hora",
      tone: "violet",
      layout: "frame",
    },
    chaptersNote: "Índice completo: 30 páginas en PDF, con 16 pedidos para copiar y una checklist de revisión.",
    chapters: [
      { number: "01", title: "Para qué sirve la IA en el aula, y para qué no", summary: "Límites de la herramienta antes de usarla con un grupo." },
      { number: "02", title: "Tu primera conversación con un chat", summary: "Cómo abrir, pedir y volver a pedir, sin jerga." },
      { number: "03", title: "El dato que la IA no tiene: tu grupo", summary: "Qué tenés que contarle para que la idea sirva en tu curso." },
      { number: "04", title: "De la planificación anual a la semana", summary: "Bajar un tema grande a cinco días." },
      { number: "05", title: "Armar una clase que entra en el módulo", summary: "Inicio, desarrollo y cierre con tiempos." },
      { number: "06", title: "Actividades para ritmos distintos", summary: "Variar una misma consigna sin armar dos clases." },
      { number: "07", title: "Revisar lo que escribió la IA", summary: "Datos, tono y si se puede hacer de verdad." },
      { number: "08", title: "Una rutina de una hora para toda la semana", summary: "El método, paso a paso, con tiempos." },
    ],
    forYou: [
      "Planificás clases y el domingo se te va en eso.",
      "Escuchaste de la IA y no sabés por dónde entrar.",
      "Querés algo corto para usar esta semana, no un curso largo.",
    ],
    notForYou: [
      "Buscás aprender a programar.",
      "Ya armás todo tu trabajo con IA y querés un nivel avanzado.",
    ],
    manuscriptReady: true,
  },
  soon({
    slug: "ia-para-devolver-trabajos",
    title: "IA para devolver trabajos sin llevarte el finde",
    promise: "La devolución, en un rato. El finde, para vos.",
    description: "Cómo pedirle a un chat comentarios útiles para un trabajo, y revisar que no digan cualquier cosa. Todavía no está a la venta.",
    category: "docentes",
    priceArs: 9000,
    pages: 36,
    minutes: 40,
    tone: "lavender",
    layout: "band",
    headline: "Devolver trabajos",
    line: "El finde, para vos",
    outcomes: ["Armar un comentario claro en vez de una nota suelta.", "Marcar qué tiene que revisar la persona, no la IA.", "Salir del finde con la pila más baja."],
    chapters: [
      { number: "01", title: "Qué puede mirar un chat y qué no", summary: "El criterio sigue siendo tuyo." },
      { number: "02", title: "El pedido para un comentario", summary: "Con la consigna y el trabajo, no con un juicio genérico." },
      { number: "03", title: "Revisar el tono", summary: "Que se pueda decir en voz alta frente al curso." },
      { number: "04", title: "Una tanda de una hora", summary: "Varios trabajos, el mismo método." },
    ],
    forYou: ["Corregís y el finde se te va en eso.", "Querés comentarios parejos sin sonar a robot."],
    notForYou: ["Buscás que la IA ponga la nota sola.", "Ya tenés una rúbrica que te cierra y no querés tocarla."],
    pairsWith: FLAGSHIP_SLUG,
  }),
  soon({
    slug: "ia-para-la-reunion",
    title: "IA para la reunión que se va de tema",
    promise: "Salís con decisiones, no con otra nota suelta.",
    description: "Un método corto para anotar mientras hablan y pedirle al chat que ordene tareas, dueños y fechas. Todavía no está a la venta.",
    category: "productividad",
    priceArs: 9000,
    pages: 32,
    minutes: 35,
    tone: "ink",
    layout: "split",
    headline: "La reunión",
    line: "Decisiones, no notas",
    outcomes: ["Anotar solo lo que se decidió.", "Pasar la nota a tareas con nombre y fecha.", "Mandar un cierre corto al equipo."],
    chapters: [
      { number: "01", title: "Qué anotar mientras hablan", summary: "Decisiones, dueños y fechas." },
      { number: "02", title: "El pedido para ordenar la nota", summary: "Sin inventar lo que nadie dijo." },
      { number: "03", title: "El mensaje de cierre", summary: "Un texto corto para mandar." },
      { number: "04", title: "Cuando la reunión no decidió nada", summary: "Cómo decirlo sin agregar tareas falsas." },
    ],
    forYou: ["Salís de las reuniones con notas que no se pueden ejecutar.", "Querés un método corto, no otra app."],
    notForYou: ["Buscás un software de minutas.", "Facilitás reuniones como oficio y querés un nivel avanzado."],
    pairsWith: "ia-para-el-mail",
  }),
  soon({
    slug: "ia-para-la-semana-laboral",
    title: "IA para armar la semana laboral en una hora",
    promise: "Cinco días, con lo que de verdad entra.",
    description: "Bajar prioridades, reuniones y huecos a una semana que se puede cumplir. Todavía no está a la venta.",
    category: "productividad",
    priceArs: 9000,
    pages: 40,
    minutes: 45,
    tone: "paper",
    layout: "stack",
    headline: "La semana laboral",
    line: "Una hora, cinco días",
    outcomes: ["Elegir qué entra y qué se corre.", "Armar los cinco días con tus límites.", "Ver choques antes del lunes."],
    chapters: [
      { number: "01", title: "Qué entra y qué no", summary: "Prioridades antes que el calendario." },
      { number: "02", title: "El pedido de los cinco días", summary: "Con tus límites, no un horario ideal." },
      { number: "03", title: "Revisar choques", summary: "Lo que depende de otra persona." },
      { number: "04", title: "El lunes a la mañana", summary: "Una mirada de diez minutos." },
    ],
    forYou: ["El lunes arranca sin plan.", "Querés ordenar, no hacer más."],
    notForYou: ["Buscás un sistema completo de productividad.", "Ya planificás la semana y solo querés atajos."],
    pairsWith: "ia-para-la-reunion",
  }),
  soon({
    slug: "ia-para-el-mail",
    title: "IA para el mail que venís postergando",
    promise: "El mail difícil, en un borrador que sí mandarías.",
    description: "Cómo pedir un texto claro para una conversación incómoda, y sacar lo que suena falso. Todavía no está a la venta.",
    category: "productividad",
    priceArs: 8000,
    pages: 28,
    minutes: 30,
    tone: "violet",
    layout: "band",
    headline: "El mail",
    line: "El que venís postergando",
    outcomes: ["Decir el punto en la primera oración.", "Bajar el tono sin esconder el pedido.", "Salir con un borrador listo para leer en voz alta."],
    chapters: [
      { number: "01", title: "Para qué es el mail", summary: "Un pedido, un no, o un cierre." },
      { number: "02", title: "El dato que no podés omitir", summary: "Hechos, no ánimo." },
      { number: "03", title: "Sacar lo que suena a robot", summary: "Tu voz, en menos líneas." },
      { number: "04", title: "Cuándo no mandarlo", summary: "Si conviene hablarlo." },
    ],
    forYou: ["Tenés un mail abierto hace días.", "Querés decir algo difícil sin enroscarte."],
    notForYou: ["Buscás plantillas de marketing.", "Escribís mails todo el día y querés un manual largo."],
    pairsWith: "ia-para-la-reunion",
  }),
  soon({
    slug: "ia-para-estudiar",
    title: "IA para estudiar un tema en 45 minutos",
    promise: "Un tema, explicado con tus palabras.",
    description: "Pedirle a un chat que explique, pregunte y arme un repaso corto. El examen lo rendís vos. Todavía no está a la venta.",
    category: "estudiantes",
    priceArs: 9000,
    pages: 36,
    minutes: 40,
    tone: "ink",
    layout: "frame",
    headline: "Estudiar",
    line: "Un tema en 45 minutos",
    outcomes: ["Entender el tema antes de memorizar.", "Armar preguntas que descubren huecos.", "Cerrar con un repaso que entra en una sentada."],
    chapters: [
      { number: "01", title: "Qué pedirle y qué no", summary: "El chat no rinde el examen." },
      { number: "02", title: "Explicarlo con tus palabras", summary: "De la definición a un ejemplo propio." },
      { number: "03", title: "El hueco", summary: "Preguntas que no sabés responder." },
      { number: "04", title: "Los 45 minutos", summary: "Un orden para no saltar de pestaña." },
    ],
    forYou: ["El material se te hace una pared.", "Querés una rutina corta."],
    notForYou: ["Buscás que la IA haga el trabajo final.", "Ya tenés un método que te cierra."],
    pairsWith: "ia-para-el-parcial",
  }),
  soon({
    slug: "ia-para-el-parcial",
    title: "IA para el parcial del lunes",
    promise: "Repasar lo que puede caer, sin releer todo.",
    description: "Una tarde para pasar de la carpeta abierta a una lista de temas y preguntas. Todavía no está a la venta.",
    category: "estudiantes",
    priceArs: 8000,
    pages: 30,
    minutes: 35,
    tone: "paper",
    layout: "split",
    headline: "El parcial",
    line: "La tarde anterior",
    outcomes: ["Elegir qué repasar y qué soltar.", "Armar preguntas parecidas a las de la materia.", "Detectar el tema que todavía no podés explicar."],
    chapters: [
      { number: "01", title: "La lista corta", summary: "No se repasa la carpeta entera." },
      { number: "02", title: "Preguntas de práctica", summary: "Con el programa, no con temas inventados." },
      { number: "03", title: "Explicarlo en voz alta", summary: "Si no sale, no está." },
      { number: "04", title: "La hora final", summary: "Qué mirar y qué cerrar." },
    ],
    forYou: ["Tenés un parcial cerca y mucho material.", "Querés practicar, no resumir por resumir."],
    notForYou: ["Buscás las respuestas del examen.", "La materia es práctica de taller y no entra en preguntas."],
    pairsWith: "ia-para-estudiar",
  }),
  soon({
    slug: "ia-para-leer-un-paper",
    title: "IA para leer un paper sin perderte",
    promise: "El argumento, en una página tuya.",
    description: "Cómo pedirle a un chat que marque la pregunta, el método y el límite de un texto, y comprobar que no inventó. Todavía no está a la venta.",
    category: "estudiantes",
    priceArs: 9000,
    pages: 34,
    minutes: 40,
    tone: "lavender",
    layout: "stack",
    headline: "Leer un paper",
    line: "Sin perder el hilo",
    outcomes: ["Ubicar la pregunta del texto.", "Separar lo que dice de lo que el chat agrega.", "Quedarte con una ficha que podés citar."],
    chapters: [
      { number: "01", title: "Qué mirar primero", summary: "Pregunta, método, límite." },
      { number: "02", title: "El pedido", summary: "Que marque, no que opine." },
      { number: "03", title: "Chequear una cita", summary: "Volver al párrafo." },
      { number: "04", title: "Tu ficha", summary: "Una página, con tus palabras." },
    ],
    forYou: ["Leés papers para la facultad o el trabajo y te perdés.", "Querés una ficha, no un resumen inflado."],
    notForYou: ["Buscás que la IA escriba el marco teórico.", "Ya leés papers todas las semanas y querés técnica fina."],
    pairsWith: "ia-para-estudiar",
  }),
  soon({
    slug: "ia-para-escribir",
    title: "IA para salir de la hoja en blanco",
    promise: "Un borrador para corregir, no una página perfecta.",
    description: "Idea, estructura y una primera versión. La voz la ponés vos al editar. Todavía no está a la venta.",
    category: "creatividad",
    priceArs: 9000,
    pages: 38,
    minutes: 45,
    tone: "deep",
    layout: "frame",
    headline: "La hoja en blanco",
    line: "Un borrador, hoy",
    outcomes: ["Pasar de una idea vaga a una frase.", "Tener una estructura que se puede seguir.", "Editar lo que suena ajeno."],
    chapters: [
      { number: "01", title: "La idea en una frase", summary: "Antes de pedir párrafos." },
      { number: "02", title: "Una estructura", summary: "Inicio, nudos y cierre." },
      { number: "03", title: "El primer borrador", summary: "Corto a propósito." },
      { number: "04", title: "Sacar la voz prestada", summary: "Datos, tono y lo que sobra." },
    ],
    forYou: ["Te trabás al empezar un texto.", "Querés un borrador para editar."],
    notForYou: ["Buscás un taller literario.", "Querés publicar sin leer lo que salió."],
    pairsWith: "ia-para-un-cuento",
  }),
  soon({
    slug: "ia-para-un-cuento",
    title: "IA para un cuento de una sentada",
    promise: "Un cuento corto, con un final que cierra.",
    description: "Personaje, giro y un texto breve para reescribir. No es un generador de novelas. Todavía no está a la venta.",
    category: "creatividad",
    priceArs: 8000,
    pages: 32,
    minutes: 40,
    tone: "paper",
    layout: "band",
    headline: "Un cuento",
    line: "De una sentada",
    outcomes: ["Elegir un personaje y un problema.", "Llegar a un giro sin relleno.", "Reescribir el final con tu oído."],
    chapters: [
      { number: "01", title: "Una persona y un problema", summary: "Nada más, al principio." },
      { number: "02", title: "La escena", summary: "Dónde pasa y qué se ve." },
      { number: "03", title: "El giro", summary: "Una sola vuelta." },
      { number: "04", title: "Leerlo en voz alta", summary: "Lo que choca, se va." },
    ],
    forYou: ["Querés escribir ficción corta y no arrancás.", "Te sirve un límite de una sentada."],
    notForYou: ["Buscás una novela.", "Querés que el chat firme el cuento."],
    pairsWith: "ia-para-escribir",
  }),
  soon({
    slug: "ia-para-el-cv",
    title: "IA para reescribir tu CV con lo que hiciste",
    promise: "El CV dice lo que hiciste, no adjetivos.",
    description: "Pasar cargos vagos a hechos, sin inventar experiencia. Todavía no está a la venta.",
    category: "trabajo",
    priceArs: 9000,
    pages: 34,
    minutes: 40,
    tone: "ink",
    layout: "stack",
    headline: "Tu CV",
    line: "Hechos, no adjetivos",
    outcomes: ["Sacar los adjetivos vacíos.", "Contar un logro con número o resultado.", "Dejar una página que se puede leer rápido."],
    chapters: [
      { number: "01", title: "El puesto al que apuntás", summary: "Un CV no sirve para todo." },
      { number: "02", title: "De la tarea al resultado", summary: "Qué cambió porque estuviste." },
      { number: "03", title: "Lo que no se inventa", summary: "Si no pasó, no entra." },
      { number: "04", title: "Una página", summary: "Cortar hasta que se pueda leer de un saque." },
    ],
    forYou: ["Tu CV suena genérico y lo sabés.", "Querés postularte sin inventar."],
    notForYou: ["Buscás un portal de empleo.", "Querés que el texto mienta un poco."],
    pairsWith: "ia-para-la-entrevista",
  }),
  soon({
    slug: "ia-para-la-entrevista",
    title: "IA para practicar la entrevista",
    promise: "Ensayar respuestas con tus casos, no con frases de manual.",
    description: "Preguntas probables y una forma de contestar con algo que te pasó. Todavía no está a la venta.",
    category: "trabajo",
    priceArs: 9000,
    pages: 36,
    minutes: 40,
    tone: "violet",
    layout: "split",
    headline: "La entrevista",
    line: "Tus casos, no un manual",
    outcomes: ["Armar tres historias que podés contar.", "Responder sin recitar.", "Ver la pregunta que te deja en blanco."],
    chapters: [
      { number: "01", title: "El puesto en una frase", summary: "Qué están buscando." },
      { number: "02", title: "Tres historias", summary: "Un problema, lo que hiciste, qué pasó." },
      { number: "03", title: "La pregunta incómoda", summary: "Practicarla antes." },
      { number: "04", title: "Lo que no hay que inventar", summary: "Si no lo hiciste, se nota." },
    ],
    forYou: ["Tenés una entrevista y ensayás en la cabeza.", "Querés sonar a vos."],
    notForYou: ["Buscás trampas para el entrevistador.", "Ya das entrevistas todas las semanas."],
    pairsWith: "ia-para-el-cv",
  }),
  soon({
    slug: "ia-para-el-menu",
    title: "IA para el menú de la semana",
    promise: "Qué se come, con lo que hay y el tiempo que tenés.",
    description: "Armar cinco comidas sin un recetario infinito ni ingredientes de otro país. Todavía no está a la venta.",
    category: "vida-diaria",
    priceArs: 8000,
    pages: 28,
    minutes: 30,
    tone: "lavender",
    layout: "frame",
    headline: "El menú",
    line: "Cinco comidas, una lista",
    outcomes: ["Elegir comidas que se repiten en serio.", "Salir con una lista de compras corta.", "Dejar afuera lo que no vas a cocinar."],
    chapters: [
      { number: "01", title: "El tiempo real", summary: "Entre semana no es domingo." },
      { number: "02", title: "Lo que ya tenés", summary: "Antes de comprar de más." },
      { number: "03", title: "Cinco comidas", summary: "Con repetición, a propósito." },
      { number: "04", title: "La lista", summary: "Lo que falta, nada más." },
    ],
    forYou: ["Todos los días decidís la comida a las ocho de la noche.", "Querés una semana simple."],
    notForYou: ["Buscás alta cocina.", "Seguís una dieta clínica y necesitás a un profesional."],
    pairsWith: "ia-para-el-desorden",
  }),
  soon({
    slug: "ia-para-el-desorden",
    title: "IA para bajar el desorden en una hora",
    promise: "Una zona, una hora, y se nota.",
    description: "Elegir un lugar de la casa y pedir un orden que se puede hacer hoy, no una mudanza. Todavía no está a la venta.",
    category: "vida-diaria",
    priceArs: 7000,
    pages: 24,
    minutes: 25,
    tone: "ink",
    layout: "band",
    headline: "El desorden",
    line: "Una zona, una hora",
    outcomes: ["Elegir una sola zona.", "Decidir qué se queda, qué se va y qué se guarda.", "Terminar en una hora, de verdad."],
    chapters: [
      { number: "01", title: "No es toda la casa", summary: "Una mesa, un estante, un cajón." },
      { number: "02", title: "Tres pilas", summary: "Queda, se va, no sé." },
      { number: "03", title: "El pedido", summary: "Un orden para esa zona, no un sistema eterno." },
      { number: "04", title: "Parar", summary: "Cuando pasa la hora, se corta." },
    ],
    forYou: ["El desorden te gana y no sabés por dónde entrar.", "Querés ver un cambio hoy."],
    notForYou: ["Buscás un método de organización para toda la vida.", "Necesitás vaciar una casa entera."],
    pairsWith: "ia-para-el-menu",
  }),
  soon({
    slug: "ia-para-un-viaje",
    title: "IA para armar un viaje corto",
    promise: "Tres días, con un plan que entra en el bolsillo.",
    description: "Destino, ritmo y una lista corta. Sin un itinerario de doce páginas. Todavía no está a la venta.",
    category: "vida-diaria",
    priceArs: 8000,
    pages: 30,
    minutes: 35,
    tone: "paper",
    layout: "stack",
    headline: "Un viaje corto",
    line: "Tres días, un plan",
    outcomes: ["Decidir el ritmo antes que los lugares.", "Armar tres días sin llenarlos.", "Salir con una lista de lo que sí hay que llevar."],
    chapters: [
      { number: "01", title: "Para qué es el viaje", summary: "Descansar no es ver todo." },
      { number: "02", title: "Tres anclas", summary: "Un lugar por día, nada más." },
      { number: "03", title: "Cómo moverte", summary: "Tiempos reales, no el mapa ideal." },
      { number: "04", title: "La lista chica", summary: "Lo que duele olvidar." },
    ],
    forYou: ["Armás viajes y se te va en pestañas.", "Preferís tres días holgados a una maratón."],
    notForYou: ["Buscás una agencia.", "El viaje es de un mes y querés una guía larga."],
    pairsWith: "ia-para-el-menu",
  }),
];

export type Product = CatalogProduct;

export const formats = [
  { id: "ebook", label: "Ebook", active: true },
  { id: "ebook-prompts", label: "Ebook + pack de prompts", active: false },
] as const;

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

export type SortId = "destacados" | "precio" | "titulo" | "lectura";

export function isSortId(value: string): value is SortId {
  return value === "destacados" || value === "precio" || value === "titulo" || value === "lectura";
}

export function catalogHref(input: { categoria?: string; q?: string; orden?: string } = {}): string {
  const params = new URLSearchParams();
  if (input.categoria) params.set("categoria", input.categoria);
  if (input.q) params.set("q", input.q);
  if (input.orden && input.orden !== "destacados") params.set("orden", input.orden);
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

export function filterProducts(input: { categoria?: string; q?: string; orden?: string }): Product[] {
  const category = input.categoria && isCategoryId(input.categoria) ? input.categoria : undefined;
  const query = input.q?.trim().toLowerCase() ?? "";
  const list = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!query) return true;
    const haystack = `${product.title} ${product.promise} ${product.description} ${categoryLabel(product.category)}`.toLowerCase();
    return haystack.includes(query);
  });
  const orden: SortId = input.orden && isSortId(input.orden) ? input.orden : "destacados";
  const sorted = [...list];
  if (orden === "precio") {
    sorted.sort((a, b) => (resolvePriceArs(a) ?? 0) - (resolvePriceArs(b) ?? 0));
  } else if (orden === "titulo") {
    sorted.sort((a, b) => a.title.localeCompare(b.title, "es"));
  } else if (orden === "lectura") {
    sorted.sort((a, b) => a.minutes - b.minutes);
  } else {
    sorted.sort((a, b) => Number(b.status === "available") - Number(a.status === "available") || a.title.localeCompare(b.title, "es"));
  }
  return sorted;
}

export function relatedProducts(slug: string): Product[] {
  const current = getProduct(slug);
  if (!current) return [];
  const same = products.filter((product) => product.slug !== slug && product.category === current.category);
  const rest = products.filter((product) => product.slug !== slug && product.category !== current.category);
  return [...same, ...rest].slice(0, 4);
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

