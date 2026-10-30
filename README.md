# IA para docentes

Landing para vender el ebook **IA para docentes: planificá tu semana en 1 hora**. El pago entra por Mercado Pago Checkout Pro. Si el pago queda aprobado, un webhook verifica la firma, guarda el pedido en Supabase y manda por Resend un enlace de descarga que vence.

Los textos de la página están en [`src/content/site.ts`](src/content/site.ts). Los diez prompts gratis están en [`src/content/prompts.ts`](src/content/prompts.ts).

## Qué es placeholder

- El manuscrito **no está escrito**. `manuscriptReady` en `src/content/site.ts` está en `false` y la home lo dice.
- La descarga, mientras no configures Storage, es `private/ebook/placeholder.pdf`. Cada página dice que es un marcador.
- El índice de capítulos y las citas de las tarjetas de color están marcados como borrador.
- La sección «Lo que dicen los docentes» trae tarjetas etiquetadas **Testimonio de ejemplo**. En producción (`NODE_ENV=production`) esa sección **no se renderiza** si no hay opiniones con `placeholder: false`. No agregues frases inventadas.
- El pie tiene campos `[PLACEHOLDER]` para el nombre de quien vende, el contacto, los datos fiscales y las políticas. Completalos antes de publicar.
- `PRICE_ARS=12000` en `.env.example` es un ejemplo de configuración, no un tipo de cambio. Pone el equivalente vigente de US$ 9 a 12.

## Requisitos

- Node.js 22
- Una cuenta de [Mercado Pago](https://www.mercadopago.com.ar/developers)
- Un proyecto de [Supabase](https://supabase.com)
- Un dominio verificado en [Resend](https://resend.com)
- Una cuenta de Vercel para el deploy

## Variables

Copiá el ejemplo y completalo:

```bash
cp .env.example .env.local
```

| Variable | Dónde sale |
| --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | Tus integraciones → tu aplicación → Credenciales |
| `MERCADOPAGO_WEBHOOK_SECRET` | Tus integraciones → Webhooks → revelar secret |
| `MERCADOPAGO_SANDBOX` | `true` mientras pruebes. Si el token empieza con `TEST-`, el sandbox se activa solo |
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` (solo servidor) |
| `EBOOK_STORAGE_BUCKET` / `EBOOK_STORAGE_PATH` | Vacío hasta que subas el PDF real |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | Un remitente del dominio verificado, por ejemplo `IA para docentes <hola@tudominio.com>` |
| `SITE_URL` | URL pública, sin barra final |
| `PRICE_ARS` | Entero en pesos |
| `DOWNLOAD_TTL_HOURS` | Validez del enlace del mail. Por defecto 72 |

No uses la clave `anon` ni pongas la service role en una variable `NEXT_PUBLIC_`.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:3457](http://127.0.0.1:3457). Sin las claves de Mercado Pago, Supabase y Resend la landing se ve igual. Comprar o pedir los prompts responde que falta la configuración.

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## 1. Supabase

1. Creá un proyecto.
2. En el SQL Editor, pegá y ejecutá [`supabase/migrations/20261030213000_orders_and_leads.sql`](supabase/migrations/20261030213000_orders_and_leads.sql).
3. Eso crea `orders` y `leads`, activa RLS y **no** agrega policies: `anon` y `authenticated` no pueden leer ni escribir. La app entra con la service role, que saltea RLS.
4. La misma migración crea el bucket privado `ebooks` si el esquema `storage` existe. No lo pongas público.
5. Cuando tengas el PDF final, subilo a `ebooks/ia-para-docentes.pdf`.
6. Recién ahí completá `EBOOK_STORAGE_BUCKET=ebooks` y `EBOOK_STORAGE_PATH=ia-para-docentes.pdf`, y pasá `manuscriptReady` a `true` en `src/content/site.ts`.

El enlace del mail apunta a `/descarga/[token]`. Ese token vive en la base y vence a las `DOWNLOAD_TTL_HOURS`. Si el bucket está configurado, la ruta redirige a una URL firmada de Storage que dura dos minutos. Si no, sirve el PDF marcador.

## 2. Mercado Pago

1. En [Tus integraciones](https://www.mercadopago.com.ar/developers/panel/app), creá una aplicación con Checkout Pro.
2. Copiá el Access Token de **prueba** a `MERCADOPAGO_ACCESS_TOKEN`.
3. En Webhooks, la URL de producción es `https://TU-DOMINIO/api/webhooks/mercadopago`. Evento: **pagos**.
4. Revelá el secret y guardalo en `MERCADOPAGO_WEBHOOK_SECRET`.
5. Dejá `MERCADOPAGO_SANDBOX=true` hasta terminar las pruebas.

El servidor crea la preferencia con el SDK oficial. El precio sale de `PRICE_ARS`, no del navegador. Con `binary_mode` el pago sale aprobado o rechazado. `auto_return` y `notification_url` se mandan solo si `SITE_URL` es `https` (Mercado Pago no llama a localhost).

La firma se valida con `WebhookSignatureValidator` del SDK: header `x-signature`, `x-request-id` y el query `data.id`. No aplicamos una ventana corta de tiempo porque Mercado Pago reintenta el aviso cada 15 minutos. Un reintento no manda dos mails: el pedido es único por proveedor + id de pago.

Después de validar, se consulta `GET /v1/payments/{id}`. Solo un pago `approved` de este producto dispara la entrega.

## 3. Resend

1. Agregá y verificá tu dominio (registros DNS que indica Resend).
2. Creá una API key.
3. `EMAIL_FROM` tiene que usar ese dominio. Un `onboarding@resend.dev` solo sirve para pruebas limitadas de Resend, no para tus compradores.

Hay dos mails: la descarga del ebook y los 10 prompts.

## 4. Deploy en Vercel

1. Importá el repositorio. Framework: Next.js. No hace falta un comando de build distinto.
2. Cargá todas las variables de `.env.example` en el entorno de Production (y Preview, si querés probar ahí).
3. `SITE_URL` tiene que ser la URL final, con `https`, sin barra al final. Si la cambiás, volvé a desplegar.
4. Cuando el deploy esté verde, configurá el webhook de Mercado Pago con `https://TU-DOMINIO/api/webhooks/mercadopago`.
5. Hacé una compra de prueba. Si el pago se aprueba, el mail llega solo. Las páginas `/pago/exito`, `/pago/error` y `/pago/pendiente` no entregan el archivo: la entrega la hace el webhook.

## 5. Probar con el sandbox

La documentación vigente está en [cuentas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/test-accounts) y [tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/test/cards).

1. La cuenta vendedor de Checkout Pro se crea con la aplicación. Sus credenciales de prueba son las que copiaste.
2. Creá un **usuario de prueba comprador** en el panel, del mismo país (Argentina). Iniciá sesión con ese usuario en una ventana de incógnito al pagar. No uses tu usuario real.
3. Tarjetas de prueba (CVV `123`, vencimiento `11/30`; American Express usa CVV de 4 dígitos):

| Tipo | Marca | Número |
| --- | --- | --- |
| Crédito | Mastercard | `5031 7557 3453 0604` |
| Crédito | Visa | `4509 9535 6623 3704` |
| Débito | Visa | `4002 7686 9439 5619` |

4. El nombre del titular define el resultado. Documento de los casos con DNI: `12345678`.

| Resultado | Nombre del titular |
| --- | --- |
| Aprobado | `APRO` |
| Rechazado | `OTHE` |
| Pendiente | `CONT` |

5. Un pago `APRO` tiene que crear una fila en `orders` y un mail. Repetir el aviso del webhook no crea otra fila ni otro mail.
6. Un pago `OTHE` no tiene que crear pedido ni mail.
7. Los tests automáticos cubren aprobado, duplicado, rechazado y firma inválida, con Supabase, Resend y Mercado Pago simulados:

```bash
npm test
```

Para un webhook real hace falta una URL pública. En local, Mercado Pago no llega a `127.0.0.1`.

## Lemon Squeezy, después

La entrega no sabe si el pago vino de Mercado Pago. `deliverDigitalOrder` recibe un pago ya normalizado (`provider`, id, email, monto, moneda, producto). La tabla `orders` acepta `lemonsqueezy`. El archivo [`src/lib/payments/lemonsqueezy.ts`](src/lib/payments/lemonsqueezy.ts) deja el lugar: verificar la firma de Lemon Squeezy, traducir la orden pagada y llamar a la misma función. No hay que reescribir el mail ni el enlace.

## Personalizar

- Textos, capítulos, preguntas y tarjetas: `src/content/site.ts`.
- Prompts del mail gratis: `src/content/prompts.ts`.
- Precio: `PRICE_ARS`. La home lo lee en cada request, así que un cambio en Vercel se ve sin volver a construir el sitio. El cobro usa el mismo valor.
- Para publicar una opinión real, agregá un objeto en `testimonials` con `placeholder: false` y datos de una persona que haya dicho esa frase. No marques como real un texto de ejemplo.
