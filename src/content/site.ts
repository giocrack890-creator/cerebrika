export type Testimonial = {
  id: string;
  placeholder: boolean;
  tag: string;
  quote: string;
  name: string;
  role: string;
};

/**
 * Todo el texto visible del sitio vive acá.
 * Precio, mails y claves no: eso sale de las variables de entorno.
 * Un texto que empieza con "[" es un marcador: el sitio no lo muestra al público.
 */
export const site = {
  brand: {
    name: "Cerebrika",
    tagline: "Ebooks cortos de IA",
    description:
      "Ebooks cortos para usar la IA en un trabajo concreto. El primero es para docentes: planificá tu semana de clases en una hora.",
  },
  /** Se muestra junto a cada botón de compra mientras la entrega no esté lista (texto o archivo en Storage). */
  placeholderNotice:
    "El texto final todavía no está publicado. Si comprás ahora, el PDF que llega es un marcador de posición, no el libro.",
  hero: {
    kicker: "Ebook para docentes",
    title: "Planificá la semana de clases en una hora.",
    subtitle:
      "Un ebook corto para pasar de la hoja en blanco a cinco días con inicio, desarrollo y cierre, usando un chat de IA. Sin jerga y sin instalar nada.",
    cta: "Quiero el ebook",
    secondary: "Ver qué hay adentro",
  },
  trust: [
    { id: "pago", title: "Pago único", body: "Con Mercado Pago. Sin suscripción ni cuotas que se renueven." },
    { id: "mail", title: "Llega a tu mail", body: "El enlace de descarga sale cuando el pago queda aprobado." },
    { id: "cuenta", title: "Lo volvés a bajar", body: "Desde Mis compras te reenviamos el enlace cuando lo necesites." },
  ],
  week: {
    kicker: "Antes y después",
    title: "El domingo deja de ser para planificar.",
    beforeLabel: "Como suele ser",
    afterLabel: "Con el método",
    before: [
      "La hoja en blanco se come el domingo.",
      "Las ideas salen de lugares distintos y no entran en la hora de clase.",
      "Abrís un chat de IA y no sabés qué pedirle.",
    ],
    after: [
      "Una hora, con pedidos claros y en castellano.",
      "Cinco días con inicio, desarrollo y cierre.",
      "Una lista corta para revisar lo que escribió la IA antes de usarlo.",
    ],
  },
  /**
   * Historia de quién escribe y por qué. No se muestra hasta que ready sea true
   * y el texto sea real: no inventamos una historia.
   */
  story: {
    ready: false,
    kicker: "Por qué existe",
    title: "[PLACEHOLDER] Título de la historia",
    paragraphs: ["[PLACEHOLDER] Contá quién escribe el ebook y por qué. Dos o tres párrafos cortos."],
    signature: "[PLACEHOLDER] Nombre",
  },
  /** Los pasos salen de los capítulos del ebook. Si cambia el índice, revisá esto. */
  method: {
    kicker: "El método",
    title: "Una hora, cuatro pasos.",
    body: "El libro sigue siempre el mismo recorrido. Lo hacés una vez y después lo repetís cada semana.",
    steps: [
      { id: "grupo", title: "Contale tu grupo", body: "Lo que la IA no sabe: edad, materia, tiempos y recursos del aula.", chapter: "03" },
      { id: "pedido", title: "Pedí la clase", body: "Inicio, desarrollo y cierre, con un pedido claro y en castellano.", chapter: "05" },
      { id: "revision", title: "Revisá antes del aula", body: "Datos, tono y si la actividad entra de verdad en tu hora.", chapter: "07" },
      { id: "semana", title: "Armá la semana", body: "Repetís el pedido para los cinco días y cerrás la planificación.", chapter: "08" },
    ],
  },
  compare: {
    kicker: "Antes y después",
    title: "La diferencia está en cómo lo pedís.",
    body: "Un pedido vago trae una respuesta genérica. Uno con contexto trae una clase que se puede dar.",
    vagueLabel: "Pedido vago",
    vague: "Haceme una clase de fracciones.",
    vagueResult: "Una clase genérica, sin edad ni tiempos, que hay que rehacer.",
    goodLabel: "Pedido con contexto",
    good: "Soy docente de 5º grado. Tengo 40 minutos y no hay proyector. Armame una clase de introducción a fracciones con inicio, desarrollo y cierre, y un error común que tenga que anticipar.",
    goodResult: "Una clase con tiempos, consignas y materiales que entran en tu aula.",
    note: "Ejemplo armado para mostrar la idea. El ebook trae los pedidos completos.",
  },
  offer: {
    kicker: "Qué incluye",
    title: "Todo lo que te llevás",
    items: [
      "Ebook en PDF, para leer en el celu o imprimir",
      "Ocho capítulos cortos, del primer chat a la rutina semanal",
      "Pedidos listos para copiar y completar",
      "Lista para revisar lo que escribió la IA",
      "Reenvío del enlace desde Mis compras cuando lo necesites",
    ],
    terms: "Pago único. Sin suscripción ni cuotas que se renueven.",
  },
  how: {
    kicker: "Cómo funciona",
    title: "Tres pasos, y el domingo ya lo estás usando.",
    steps: [
      {
        id: "pagar",
        title: "Pagás una vez",
        body: "Con Mercado Pago: tarjeta, débito o dinero en cuenta.",
      },
      {
        id: "recibir",
        title: "Te llega el PDF",
        body: "Cuando el pago se aprueba, te mandamos el enlace de descarga al mail.",
      },
      {
        id: "usar",
        title: "Lo usás con tu grupo",
        body: "Seguís el método con tu materia y copiás los pedidos del libro.",
      },
    ],
  },
  preview: {
    kicker: "Así son los pedidos",
    title: "Copiás, completás los corchetes y listo.",
    body: "Estos dos son parte de los 10 prompts gratis que te mandamos por mail. El ebook trae el método completo para usarlos.",
    copy: "Copiar",
    copied: "Copiado",
  },
  chapters: {
    kicker: "El índice",
    title: "Qué hay adentro",
  },
  audience: {
    kicker: "Para quién",
    yesTitle: "Es para vos si",
    noTitle: "No es para vos si",
  },
  checkout: {
    title: "Comprar el ebook",
    body: "Te llevamos a Mercado Pago para pagar. El PDF llega a este mail cuando el pago se aprueba.",
    emailLabel: "Tu email",
    emailHint: "Ahí te mandamos el enlace de descarga.",
    emailPlaceholder: "tu@escuela.edu.ar",
    submit: "Pagar con Mercado Pago",
    submitting: "Abriendo Mercado Pago…",
    close: "Cerrar",
    missingPrice: "El precio todavía no está configurado (PRICE_ARS).",
    priceLabel: "Pago único",
    genericError: "No pudimos abrir el pago. Intentá de nuevo en un rato.",
  },
  testimonialsHeading: "Lo que dicen los docentes",
  testimonials: [
    {
      id: "ejemplo-1",
      placeholder: true,
      tag: "EJEMPLO",
      quote: "[PLACEHOLDER] Acá iría una opinión real de una docente. Este texto no es un testimonio.",
      name: "Testimonio de ejemplo",
      role: "Maqueta · no es una persona real",
    },
  ] satisfies Testimonial[],
  /**
   * El código de Mercado Pago no crea reembolsos.
   * La garantía no se muestra hasta que confirmes la política y pases confirmed a true.
   */
  guarantee: {
    confirmed: false,
    title: "Garantía de satisfacción",
    body: "[PLACEHOLDER] Definí tu política de reembolsos antes de prometer una garantía.",
  },
  lead: {
    kicker: "Gratis",
    title: "10 prompts para planificar tus clases",
    body: "Si todavía no querés el ebook, te mandamos diez pedidos por mail. Reemplazás lo que está entre corchetes con tu materia, la edad y el tema.",
    emailLabel: "Email",
    emailPlaceholder: "tu@escuela.edu.ar",
    button: "Mandámelos",
    submitting: "Enviando…",
    success: "Listo. Revisá el mail. Si no aparece en unos minutos, mirá en spam.",
    waitlistSuccess: "Listo. Te avisamos a este mail cuando se pueda comprar. No es una compra.",
    genericError: "No pudimos enviar los prompts. Intentá de nuevo en un rato.",
  },
  faqHeading: "Preguntas frecuentes",
  faqKicker: "Antes de comprar",
  faq: [
    {
      q: "¿Qué recibo?",
      a: "Un PDF por mail. Si el texto final todavía no está publicado, la página lo dice al lado del botón de compra.",
    },
    {
      q: "¿Es un curso o una suscripción?",
      a: "Ninguno de los dos. Es un ebook de pago único. No hay clases en vivo ni una cuota que se renueve.",
    },
    {
      q: "¿Cómo pago?",
      a: "Con Mercado Pago. En el checkout vas a ver los medios que ofrezca tu cuenta: tarjeta, débito o dinero en cuenta. El precio es {price}.",
    },
    {
      q: "¿Cuándo me llega?",
      a: "Cuando Mercado Pago marca el pago como aprobado, te mandamos un mail con el enlace. Puede tardar unos minutos. Si no aparece, revisá spam.",
    },
    {
      q: "¿Sirve si nunca usé un chat de IA?",
      a: "Sí. Está pensado para esa persona. No hace falta instalar programas ni saber de tecnología.",
    },
    {
      q: "¿Y si la IA se equivoca?",
      a: "Se equivoca. El ebook incluye qué revisar antes de llevar algo al aula: datos, tono y si la actividad entra en tu hora. No reemplaza tu criterio.",
    },
    {
      q: "¿Cuánto dura el enlace?",
      a: "El enlace del mail funciona durante {ttl} horas. Si se vence, lo pedís de nuevo desde Mis compras con el mismo mail.",
    },
    {
      q: "¿Y si no doy clases en Argentina?",
      a: "El método sirve para docentes de toda Latinoamérica. El texto está en castellano rioplatense y el cobro es en pesos argentinos, por Mercado Pago.",
    },
    {
      q: "¿Para quién no es?",
      a: "Si buscás aprender a programar o ya armás todo tu trabajo con IA, este ebook te va a quedar corto. Es para empezar y para ordenar la semana.",
    },
    {
      q: "¿Puedo pedir que me devuelvan el dinero?",
      a: "[PLACEHOLDER] Definí tu política de reembolsos antes de publicar.",
    },
    {
      q: "¿Qué hacen con mi email?",
      a: "Lo usamos para mandarte el ebook o los prompts gratis. No lo compartimos con herramientas de anuncios. Para medir los anuncios, el sitio puede usar el píxel de Meta, que registra visitas y compras sin tu email.",
    },
  ],
  finalCta: {
    kicker: "Esta semana",
    title: "Tu próxima semana, armada en una hora.",
    body: "Un pago único. El PDF llega a tu mail cuando Mercado Pago aprueba el pago.",
    button: "Quiero el ebook",
  },
  upcoming: {
    kicker: "Lo que viene",
    title: "Más ebooks en camino",
    body: "Están anunciados y todavía no se venden. En cada ficha podés dejar tu mail y te avisamos cuando salgan.",
    link: "Ver el catálogo",
  },
  footer: {
    line: "Ebooks cortos para usar la IA en un trabajo concreto. Pago único, entrega por mail.",
    seller: "[PLACEHOLDER: nombre o razón social de quien vende]",
    contact: "[PLACEHOLDER: email de soporte]",
    tax: "[PLACEHOLDER: CUIT u otros datos fiscales]",
  },
  payments: {
    successTitle: "Revisá tu mail",
    successBody:
      "Si Mercado Pago aprobó el pago, el enlace de descarga llega al email que cargaste. Puede tardar unos minutos. Mirá también en spam.",
    successMulti: "Si compraste más de un ebook, el mail trae un enlace por título.",
    successAccount: "Mis compras",
    errorTitle: "El pago no se completó",
    errorBody:
      "No se hizo ningún cobro por este intento. Si se rechazó el medio de pago, podés probar de nuevo con otro.",
    pendingTitle: "El pago quedó pendiente",
    pendingBody:
      "Mercado Pago todavía no lo marcó como aprobado. Si se aprueba, te llega el mail con el enlace. No hace falta pagar de nuevo.",
    back: "Volver al inicio",
    retry: "Intentar de nuevo",
  },
  download: {
    invalidTitle: "Este enlace no sirve",
    invalidBody: "No encontramos una descarga con ese código.",
    expiredTitle: "El enlace se venció",
    expiredBody: "El tiempo para descargar ya pasó. Pedí un enlace nuevo desde Mis compras con el mismo mail.",
    missingFileTitle: "El archivo no está publicado",
    missingFileBody:
      "El pago está registrado, pero el PDF todavía no está disponible. Escribí al contacto del sitio.",
  },
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith("[");
}

export function selectTestimonials(
  entries: readonly Testimonial[],
  nodeEnv: string | undefined,
): Testimonial[] {
  if (nodeEnv === "production") {
    return entries.filter((entry) => !entry.placeholder);
  }
  return [...entries];
}

/** Completa precio y vigencia, y saca las respuestas que todavía son marcadores. */
export function fillFaq(priceLabel: string, ttlHours: number) {
  return site.faq
    .filter((item) => !isPlaceholder(item.a))
    .map((item) => ({
      q: item.q,
      a: item.a.replaceAll("{price}", priceLabel).replaceAll("{ttl}", String(ttlHours)),
    }));
}
