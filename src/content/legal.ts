/**
 * Textos legales. Describen cómo funciona la tienda hoy (Mercado Pago, Supabase,
 * Resend, Vercel y el píxel de Meta). No reemplazan la revisión de un abogado o contador:
 * los datos de quien vende salen de site.footer y se muestran cuando están completos.
 * {ttl} se reemplaza por las horas de validez del enlace de descarga.
 */
export type LegalSection = { heading: string; paragraphs: readonly string[] };
export type LegalPage = { title: string; updated: string; sections: readonly LegalSection[] };

const updated = "31 de octubre de 2026";

export const legalPages = {
  terminos: {
    title: "Términos y condiciones",
    updated,
    sections: [
      {
        heading: "Qué comprás",
        paragraphs: [
          "Una licencia personal para leer y usar un ebook en PDF. Podés guardarlo en tus dispositivos e imprimirlo para tu uso. No podés revenderlo, publicarlo ni compartir el archivo en internet.",
        ],
      },
      {
        heading: "Precio y pago",
        paragraphs: [
          "El precio está en pesos argentinos y se muestra antes de pagar. Es un pago único, sin suscripción.",
          "El cobro lo procesa Mercado Pago. Cerebrika no ve ni guarda los datos de tu tarjeta o de tu cuenta.",
        ],
      },
      {
        heading: "Entrega",
        paragraphs: [
          "Cuando Mercado Pago aprueba el pago, te mandamos un mail con el enlace de descarga. El enlace es personal y funciona durante {ttl} horas. Si se vence, pedís uno nuevo desde Mis compras con el mismo mail.",
        ],
      },
      {
        heading: "Arrepentimiento y reembolsos",
        paragraphs: [
          "Podés pedir la revocación de la compra con el Botón de arrepentimiento, sin cuenta ni contraseña. Las condiciones están en la política de reembolsos.",
        ],
      },
      {
        heading: "Sobre la IA",
        paragraphs: [
          "Los ebooks enseñan a usar chats de IA de terceros. Esos chats pueden equivocarse: revisá siempre lo que escriben antes de usarlo. Cerebrika no está asociada a las empresas que los ofrecen.",
        ],
      },
      {
        heading: "Cambios",
        paragraphs: ["Si cambiamos estos términos, publicamos la versión nueva en esta página con la fecha de actualización."],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    updated,
    sections: [
      {
        heading: "Qué datos guardamos",
        paragraphs: [
          "Tu email, cuando comprás, pedís los prompts gratis, pedís un aviso o usás el Botón de arrepentimiento.",
          "Los datos del pago que nos devuelve Mercado Pago: número de operación, monto, estado y el ebook comprado. No recibimos los datos de tu tarjeta.",
        ],
      },
      {
        heading: "Para qué los usamos",
        paragraphs: [
          "Para entregarte lo que compraste, reenviarte los enlaces, mandarte lo que pediste y responder tus consultas. No vendemos ni compartimos tu email con herramientas de anuncios.",
        ],
      },
      {
        heading: "Con quién trabajamos",
        paragraphs: [
          "Mercado Pago procesa los pagos. Supabase guarda la base de datos y los archivos. Resend envía los mails. Vercel aloja el sitio.",
          "Para medir los anuncios, el sitio puede usar el píxel de Meta. El píxel usa cookies de Meta para registrar qué páginas se visitan y si hubo una compra. No le mandamos tu email ni otros datos personales. Podés bloquearlo desde la configuración de tu navegador.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: [
          "Podés pedir ver, corregir o borrar tus datos en cualquier momento, como prevé la Ley 25.326 de Protección de Datos Personales. Escribinos al contacto del sitio o respondé cualquier mail nuestro.",
        ],
      },
    ],
  },
  reembolsos: {
    title: "Política de reembolsos",
    updated,
    sections: [
      {
        heading: "Si tuviste un problema",
        paragraphs: [
          "Si el enlace no funciona, el archivo no abre o no te llegó el mail, escribinos o respondé el mail de la compra y lo resolvemos.",
        ],
      },
      {
        heading: "Botón de arrepentimiento",
        paragraphs: [
          "Podés pedir la revocación de la compra desde el Botón de arrepentimiento, sin cuenta ni contraseña. Te mandamos un código de seguimiento por mail y revisamos el pedido.",
        ],
      },
    ],
  },
} satisfies Record<string, LegalPage>;

export type LegalSlug = keyof typeof legalPages;
