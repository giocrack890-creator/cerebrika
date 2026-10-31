# Cerebrika

Tienda de ebooks cortos de IA. El primero es **IA para docentes: planificá tu semana en 1 hora**. El pago entra por Mercado Pago Checkout Pro. Si el pago queda aprobado, un webhook verifica la firma, guarda el pedido en Supabase y manda por Resend un enlace de descarga que vence. El remitente visible de esos mails es Cerebrika.

Los textos de la página están en [`src/content/site.ts`](src/content/site.ts). Los diez prompts gratis están en [`src/content/prompts.ts`](src/content/prompts.ts).

## Qué es placeholder

- El texto de «IA para docentes» está terminado (`manuscriptReady: true`), pero **mientras no subas el PDF a Storage** la descarga es `private/ebook/placeholder.pdf` y cada botón de compra lo avisa al lado. El aviso se apaga solo cuando `EBOOK_STORAGE_BUCKET` y `EBOOK_STORAGE_PATH` están cargadas (hay que volver a desplegar).
- Las opiniones: la home **no muestra** la sección mientras no haya opiniones con `placeholder: false`. No agregues frases inventadas.
- Un texto de `src/content/site.ts` que empieza con `[` es un marcador y **no se muestra al público**: los datos de quien vende en el pie, la respuesta de reembolsos del FAQ y la garantía (`guarantee.confirmed: false`). Completalos antes de publicar; mientras tanto el sitio simplemente no los muestra.
- `PRICE_ARS=12000` en `.env.example` es un ejemplo de configuración, no un tipo de cambio.

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
| `EMAIL_FROM` | Un remitente del dominio verificado, por ejemplo `Cerebrika <hola@tudominio.com>`. El nombre visible se fuerza a Cerebrika |
| `SITE_URL` | URL pública, sin barra final |
| `PRICE_ARS` | Entero en pesos |
| `DOWNLOAD_TTL_HOURS` | Validez del enlace del mail. Por defecto 72 |
| `WHATSAPP_NUMBER` | Opcional. Solo dígitos con código de país. Vacío = sin botón |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opcional. Administrador de eventos de Meta → tu píxel → id numérico. Vacío = no carga Meta |

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

La entrega no depende solo del webhook: cuando la persona vuelve a `/pago/exito`, el servidor confirma el pago con la API de Mercado Pago, graba el pedido, manda el mail y muestra el botón de descarga. Para mostrarlo exige que el `external_reference` del link coincida con el del pago (un UUID que solo tiene quien pagó). El webhook sigue sirviendo para quien cierra la pestaña antes de volver.

La preferencia manda `notification_url` con `?source_news=webhooks`, así Mercado Pago avisa solo en el formato Webhooks (el que trae firma) y no con el IPN viejo.

## 4b. Píxel de Meta

1. En el Administrador de eventos de Meta, copiá el id numérico del píxel.
2. Cargalo en Vercel como `NEXT_PUBLIC_META_PIXEL_ID` (Production y, si querés medir pruebas, Preview) y volvé a desplegar: las variables `NEXT_PUBLIC_` se fijan al construir.
3. Eventos que manda el sitio:

| Evento | Cuándo |
| --- | --- |
| `PageView` | En la carga y en cada cambio de página |
| `ViewContent` | En la home (ebook destacado) y en la ficha de un ebook a la venta |
| `AddToCart` | Al abrir la compra directa o al agregar un ebook al carrito |
| `InitiateCheckout` | Cuando Mercado Pago devuelve el link de pago, justo antes de salir del sitio |
| `Purchase` | En `/pago/exito`, solo si el servidor confirma con Mercado Pago que ese `payment_id` está aprobado. Valor = monto cobrado, moneda ARS, `eventID` = `mp-<payment_id>` |

El `Purchase` depende de que la persona vuelva al sitio después de pagar (`auto_return`, que solo funciona con `SITE_URL` en `https`). Si cierra la pestaña en Mercado Pago, el píxel no se entera; para cubrir eso hace falta la API de Conversiones de Meta desde el webhook. El píxel nunca recibe el email ni datos personales.

Probalo con la extensión Meta Pixel Helper o en Administrador de eventos → Probar eventos.

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

## Checklist para cobrar de verdad

Migraciones, en este orden, en el SQL Editor de Supabase (o `supabase db push`):

1. `supabase/migrations/20261030213000_orders_and_leads.sql`
2. `supabase/migrations/20261030230000_product_slug_and_lead_sources.sql`
3. `supabase/migrations/20261030234500_order_items.sql`
4. `supabase/migrations/20261031160000_revocation_requests.sql` (Botón de arrepentimiento)

Variables en Vercel → Settings → Environment Variables (Production):

| Variable | Valor |
| --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token de **producción** (`APP_USR-...`) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Secret del webhook de producción |
| `MERCADOPAGO_SANDBOX` | `false` |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Sin dominio propio: tu Gmail y una contraseña de aplicación de Google |
| `RESEND_API_KEY` / `EMAIL_FROM` | Solo si tenés dominio verificado en Resend (si cargás Gmail, no hacen falta) |
| `SITE_URL` | `https://tu-dominio`, sin barra final |
| `PRICE_ARS` | Precio entero en pesos |
| `EBOOK_STORAGE_BUCKET` / `EBOOK_STORAGE_PATH` | `ebooks` / `ia-para-docentes.pdf`, cuando subas el PDF real |
| `DOWNLOAD_TTL_HOURS` | Opcional, por defecto 72 |
| `SUPPORT_EMAIL` | Tu casilla de soporte: recibe los pedidos del Botón de arrepentimiento |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opcional |

El PDF del ebook:

1. El manuscrito vive en `manuscripts/ia-para-docentes.ts`, **fuera de git**: el repo es público y commitearlo regalaría el libro. Guardá un respaldo fuera del repo.
2. Generalo con `npm run ebook:pdf -- ia-para-docentes`. Sale en `dist-ebooks/ia-para-docentes.pdf`, también ignorado por git.
3. En Supabase → Storage, abrí el bucket privado `ebooks` (lo crea la primera migración) y subí el archivo con el nombre `ia-para-docentes.pdf`.
4. Cargá `EBOOK_STORAGE_BUCKET=ebooks` y `EBOOK_STORAGE_PATH=ia-para-docentes.pdf` en Vercel y volvé a desplegar.

Antes de anunciar:

- Subí el PDF (pasos de arriba).
- Completá en `src/content/site.ts` los datos de quien vende (nombre, contacto, CUIT). Revisá con tu contador o abogado los textos de `src/content/legal.ts` y definí si ofrecés garantía (`guarantee.confirmed`).
- Configurá el webhook de producción en Mercado Pago y hacé una compra real chica para ver el mail.

## Personalizar

- Textos de la home, preguntas y pie: `src/content/site.ts`. Ebooks, capítulos y tapas: `src/content/products.ts`.
- Prompts del mail gratis: `src/content/prompts.ts`.
- Precio: `PRICE_ARS`. La home lo lee en cada request, así que un cambio en Vercel se ve sin volver a construir el sitio. El cobro usa el mismo valor.
- Para publicar una opinión real, agregá un objeto en `testimonials` con `placeholder: false` y datos de una persona que haya dicho esa frase. No marques como real un texto de ejemplo.
