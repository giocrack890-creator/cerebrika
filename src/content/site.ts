export type Testimonial = {
  id: string;
  placeholder: boolean;
  tag: string;
  quote: string;
  name: string;
  role: string;
};

export type Chapter = {
  number: string;
  title: string;
  summary: string;
};

export type StackCard = {
  id: string;
  tag: string;
  color: string;
  title: string;
  body: string;
  quote: string;
  visual: "pages" | "chat" | "check" | "week";
  action: "checkout" | "prompts";
  button: string;
};

/**
 * Todo el texto visible de la landing vive acá.
 * Precio, mails y claves no: eso sale de las variables de entorno.
 */
export const site = {
  brand: {
    name: "Cerebrika",
    tagline: "Ebooks cortos de IA",
    description:
      "Cerebrika es una tienda de ebooks cortos para usar IA en un trabajo concreto. El destacado, a la venta, es para docentes: planificá tu semana en 1 hora.",
  },
  /**
   * El aviso de marcador se muestra en la ficha si ese ebook tiene manuscriptReady en false.
   */
  placeholderNotice:
    "El PDF final todavía no está publicado. Si comprás ahora, la descarga es un marcador de posición, no el libro.",
  hero: {
    kicker: "Cerebrika · ebook para docentes",
    title: "Tu semana de clases, armada en una hora.",
    subtitle:
      "El primer ebook de Cerebrika. Corto, en castellano rioplatense, para pasar de la hoja en blanco a cinco días con inicio, desarrollo y cierre. Sin jerga y sin instalar nada.",
    cta: "Quiero el ebook",
    priceNote: "Pago único. El PDF llega al mail cuando Mercado Pago aprueba.",
  },
  trust: [
    { title: "Pagás en Mercado Pago", body: "Tarjeta, dinero en cuenta u otros medios de tu cuenta." },
    { title: "Te llega por mail", body: "El enlace sale cuando el pago queda aprobado." },
    { title: "Sin suscripción", body: "Un solo pago. No hay cuota ni renovación." },
  ],
  chrome: {
    buy: "COMPRAR",
    bar: "Planificá tu semana en 1 hora",
    barButton: "COMPRAR AHORA →",
    brand: "Cerebrika",
    clockLabel: "Buenos Aires",
    nav: [
      { href: "#inicio", id: "inicio", label: "Inicio", icon: "home" },
      { href: "#metodo", id: "metodo", label: "Método", icon: "layers" },
      { href: "#adentro", id: "adentro", label: "Adentro", icon: "spark" },
      { href: "#preguntas", id: "preguntas", label: "Preguntas", icon: "help" },
    ] as const,
  },
  checkout: {
    title: "Comprar el ebook",
    body: "Te llevamos a Mercado Pago. El PDF llega al mail cuando el pago se aprueba. Pago único.",
    emailLabel: "Email",
    emailPlaceholder: "tu@escuela.edu.ar",
    submit: "Pagar con Mercado Pago",
    submitting: "Abriendo Mercado Pago…",
    close: "Cerrar",
    missingPrice: "El precio todavía no está configurado (PRICE_ARS).",
    priceLabel: "Pago único",
    genericError: "No pudimos abrir el pago. Intentá de nuevo en un rato.",
  },
  included: {
    kicker: "Qué incluye",
    title: "Un PDF corto. Lo que necesitás para esta semana.",
    intro:
      "En vez de un curso de varias semanas, un ebook para usar este domingo. El precio es un pago único: no hay módulos pagos ni suscripción.",
    anchor: "Para usar este domingo, no dentro de un mes.",
    items: [
      {
        title: "Ocho capítulos cortos",
        body: "De qué sirve la IA en el aula a la rutina de una hora para bajar la semana.",
      },
      {
        title: "Pedidos para copiar",
        body: "Frases en castellano para una clase, una rúbrica o un inicio de diez minutos.",
      },
      {
        title: "La revisión antes del aula",
        body: "Qué chequear: datos, tono y si la actividad entra en tu hora de clase.",
      },
      {
        title: "Arranque desde cero",
        body: "No hace falta haber usado un chat ni instalar programas.",
      },
    ],
  },
  cards: [
    {
      id: "semana",
      tag: "01",
      color: "#1B2744",
      title: "De la hoja en blanco a la semana",
      body: "El primer tramo ordena objetivos, actividades y un cierre para los cinco días. El capítulo sigue en redacción: esto es el recorte, no el texto final.",
      quote: "[PLACEHOLDER] Acá va una frase del manuscrito, cuando exista.",
      visual: "pages",
      action: "checkout",
      button: "Quiero el ebook",
    },
    {
      id: "prompts",
      tag: "02",
      color: "#8E3F2A",
      title: "Pedidos que podés copiar",
      body: "Frases en castellano para pedirle a un chat una clase, una rúbrica o un inicio de diez minutos. Las completás con tu materia y tu grupo.",
      quote: "[PLACEHOLDER] Cita del capítulo de prompts, pendiente de redacción.",
      visual: "chat",
      action: "prompts",
      button: "Ver prompts",
    },
    {
      id: "revision",
      tag: "03",
      color: "#1C1714",
      title: "La IA se equivoca",
      body: "Antes de llevar algo al aula hay que revisarlo. El libro marca qué chequear: datos, tono y si la actividad entra en tu hora de clase.",
      quote: "[PLACEHOLDER] Cita del capítulo de revisión, pendiente de redacción.",
      visual: "check",
      action: "checkout",
      button: "Quiero el ebook",
    },
    {
      id: "cero",
      tag: "04",
      color: "#6B4F3B",
      title: "Sirve si empezás de cero",
      body: "No hace falta haber usado un chat antes. El recorrido asume que es la primera vez y no te pide instalar programas ni saber de tecnología.",
      quote: "[PLACEHOLDER] Cita del capítulo de inicio, pendiente de redacción.",
      visual: "week",
      action: "checkout",
      button: "Quiero el ebook",
    },
  ] satisfies StackCard[],
  week: {
    kicker: "Antes y después",
    title: "El domingo deja de ser la planificación.",
    beforeLabel: "Como suele ser",
    afterLabel: "Con el método",
    before: [
      "La hoja en blanco se come el domingo.",
      "Las ideas salen de lugares distintos y no entran en la hora de clase.",
      "Si abrís un chat, no sabés qué pedirle.",
    ],
    after: [
      "Una hora, con un pedido claro y en castellano.",
      "Cinco días con inicio, desarrollo y cierre.",
      "Una lista corta para revisar lo que escribió la IA antes de usarlo.",
    ],
  },
  bridges: {
    metodo: {
      title: "Listo para probarlo con tu próxima semana.",
      detail: "Un pago. Lo usás este domingo, con tu materia y tu grupo.",
    },
    semana: {
      title: "Una hora. Cinco días armados.",
      detail: "El PDF llega al mail cuando Mercado Pago aprueba el pago.",
    },
    paraQuien: {
      title: "Si te reconocés en la primera columna, este ebook es para vos.",
      detail: "Corto a propósito. No es un curso ni un manual de programación.",
    },
    adentro: {
      title: "Ocho capítulos. Un método. Un pago.",
      detail: "El índice está en borrador y la página lo dice. El recorte ya se puede leer.",
    },
  },
  testimonialsHeading: "Lo que dicen los docentes",
  testimonialsDisclaimer:
    "Estas tarjetas son una maqueta. No hay opiniones reales cargadas: no inventamos testimonios.",
  testimonials: [
    {
      id: "ejemplo-1",
      placeholder: true,
      tag: "EJEMPLO",
      quote:
        "[PLACEHOLDER] Acá iría una opinión real de una docente. Este texto no es un testimonio.",
      name: "Testimonio de ejemplo",
      role: "Maqueta · no es una persona real",
    },
    {
      id: "ejemplo-2",
      placeholder: true,
      tag: "EJEMPLO",
      quote:
        "[PLACEHOLDER] Segunda tarjeta de diseño. Cuando haya una frase verdadera, se reemplaza esta.",
      name: "Testimonio de ejemplo",
      role: "Maqueta · no es una persona real",
    },
    {
      id: "ejemplo-3",
      placeholder: true,
      tag: "EJEMPLO",
      quote:
        "[PLACEHOLDER] Tercera tarjeta para ver el carrusel. No representa a nadie.",
      name: "Testimonio de ejemplo",
      role: "Maqueta · no es una persona real",
    },
    {
      id: "ejemplo-4",
      placeholder: true,
      tag: "EJEMPLO",
      quote:
        "[PLACEHOLDER] Cuarta tarjeta de la maqueta. Borrarla o vaciar la lista oculta la sección.",
      name: "Testimonio de ejemplo",
      role: "Maqueta · no es una persona real",
    },
  ] satisfies Testimonial[],
  audience: {
    kicker: "Para quién",
    yesTitle: "Es para vos si",
    noTitle: "No es para vos si",
    yes: [
      "Planificás clases y el domingo se te va en eso.",
      "Escuchaste de la IA y no sabés por dónde entrar.",
      "Querés algo corto para usar esta semana, no un curso largo.",
    ],
    no: [
      "Buscás aprender a programar.",
      "Ya armás todo tu trabajo con IA y querés un nivel avanzado.",
      "Necesitás hoy el libro con el texto definitivo: el manuscrito sigue en preparación.",
    ],
  },
  chaptersHeading: "Qué hay adentro",
  chaptersKicker: "El índice",
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
  ] satisfies Chapter[],
  /**
   * El código de Mercado Pago no crea reembolsos.
   * Este bloque queda a la vista como marcador hasta confirmar la política.
   */
  guarantee: {
    kicker: "A confirmar",
    title: "Garantía de satisfacción",
    flag: "Pendiente de tu confirmación. Hoy no hay reembolso automático.",
    body: "[PLACEHOLDER] Esta tienda cobra por Mercado Pago y no procesa devoluciones. No es una política de reembolso: confirmá el texto antes de prometer una garantía.",
  },
  lead: {
    kicker: "Gratis, sin comprar",
    title: "10 prompts para planificar tus clases",
    body: "Si todavía no querés el ebook, te mandamos diez pedidos por mail. Reemplazá lo que está entre corchetes con tu materia, la edad y el tema.",
    emailLabel: "Email",
    emailPlaceholder: "tu@escuela.edu.ar",
    button: "Quiero los prompts",
    submitting: "Enviando…",
    success: "Listo. Revisá el mail. Si no aparece en unos minutos, mirá spam.",
    waitlistSuccess: "Listo. Te avisamos a este mail cuando se pueda comprar. No es una compra.",
    genericError: "No pudimos enviar los prompts. Intentá de nuevo en un rato.",
  },
  faqHeading: "Preguntas antes de comprar",
  faqKicker: "Objeciones",
  faq: [
    {
      q: "¿Qué recibo?",
      a: "Un PDF por mail. El texto del ebook todavía se está escribiendo: la página lo dice arriba si la descarga sigue siendo un marcador de posición.",
    },
    {
      q: "¿Es un curso o una suscripción?",
      a: "Ninguno de los dos. Es un ebook de pago único. No hay clases en vivo ni una cuota que se renueve.",
    },
    {
      q: "¿Cómo pago?",
      a: "Con Mercado Pago. En el checkout vas a ver los medios que ofrezca tu cuenta: tarjeta, dinero en cuenta u otros. El precio de esta página es el configurado al cobrar: {price}.",
    },
    {
      q: "¿Cuándo me llega?",
      a: "Cuando Mercado Pago marca el pago como aprobado, te mandamos un mail con el enlace. Puede tardar unos minutos. Si no está, revisá spam.",
    },
    {
      q: "¿Y si la IA se equivoca?",
      a: "Se equivoca. El recorrido incluye qué revisar antes de llevar algo al aula: datos, tono y si la actividad entra en tu hora. No reemplaza tu criterio.",
    },
    {
      q: "¿Cuánto dura el enlace?",
      a: "El enlace del mail funciona durante {ttl} horas desde el envío. Si se vence, respondé ese mail y lo vemos.",
    },
    {
      q: "¿Sirve si nunca usé un chat de IA?",
      a: "Sí. Está pensado para esa persona. No hace falta instalar programas ni saber de tecnología.",
    },
    {
      q: "¿Y si no doy clases en Argentina?",
      a: "El voseo es rioplatense. El método está pensado para docentes de Latinoamérica. El cobro de esta versión es en pesos argentinos, por Mercado Pago.",
    },
    {
      q: "¿Puedo pedir que me devuelvan el dinero?",
      a: "[PLACEHOLDER] Definí tu política de reembolsos antes de publicar. El pago entra por Mercado Pago y esta tienda no procesa devoluciones automáticas. Este texto no es una política real.",
    },
    {
      q: "¿Qué hacen con mi email?",
      a: "Lo guardamos para enviarte el ebook o los prompts gratis. Esta versión no lo manda a una herramienta de anuncios.",
    },
  ],
  finalCta: {
    kicker: "Esta semana",
    title: "La planificación puede ocupar una hora. El domingo, no.",
    body: "Un pago único. El PDF llega al mail cuando Mercado Pago aprueba. Sin suscripción.",
    button: "Comprar el ebook",
  },
  footer: {
    line: "Tienda de ebooks cortos de IA. Este es el primero: para docentes. Pago único por Mercado Pago.",
    seller: "[PLACEHOLDER: nombre o razón social de quien vende]",
    contact: "[PLACEHOLDER: email de soporte]",
    tax: "[PLACEHOLDER: CUIT u otros datos fiscales]",
    legal:
      "[PLACEHOLDER: política de privacidad y de reembolsos. No publiques sin este texto.]",
  },
  payments: {
    successTitle: "Revisá tu mail",
    successBody:
      "Si Mercado Pago aprobó el pago, el enlace de descarga llega al email que cargaste. Puede tardar unos minutos. Mirá también la carpeta de spam. El enlace de esta página no descarga el archivo: el mail es la entrega.",
    errorTitle: "El pago no se completó",
    errorBody:
      "No enviamos el ebook. Si se rechazó el medio de pago, podés volver a intentar. Si viste un débito y no llega el mail, escribinos al contacto del sitio.",
    pendingTitle: "El pago quedó pendiente",
    pendingBody:
      "Mercado Pago todavía no lo marcó como aprobado. Si después se aprueba, te llega el mail con el enlace. No hace falta pagar de nuevo mientras tanto.",
    back: "Volver al inicio",
  },
  download: {
    invalidTitle: "Este enlace no sirve",
    invalidBody: "No encontramos una descarga con ese código.",
    expiredTitle: "El enlace se venció",
    expiredBody:
      "El tiempo para descargar ya pasó. Respondé el mail donde te lo enviamos y lo vemos.",
    missingFileTitle: "El archivo no está publicado",
    missingFileBody:
      "El pago está registrado, pero el PDF todavía no está en el almacenamiento. Escribí al contacto del sitio.",
  },
} as const;

export function selectTestimonials(
  entries: readonly Testimonial[],
  nodeEnv: string | undefined,
): Testimonial[] {
  if (nodeEnv === "production") {
    return entries.filter((entry) => !entry.placeholder);
  }
  return [...entries];
}

export function fillFaq(priceLabel: string, ttlHours: number) {
  return site.faq.map((item) => ({
    q: item.q,
    a: item.a.replaceAll("{price}", priceLabel).replaceAll("{ttl}", String(ttlHours)),
  }));
}
