import { FLAGSHIP_SLUG, getProduct, type Product } from "@/content/products";

/**
 * El destacado usa EBOOK_STORAGE_PATH si existe.
 * El resto usa la ruta declarada en el catálogo, dentro del mismo bucket.
 */
export function resolveProductStorage(product: Product | null): { bucket: string; path: string } | null {
  const bucket = process.env.EBOOK_STORAGE_BUCKET?.trim();
  if (!bucket || !product) return null;
  const path =
    product.slug === FLAGSHIP_SLUG
      ? process.env.EBOOK_STORAGE_PATH?.trim() || product.storagePath
      : product.storagePath;
  if (!path) return null;
  return { bucket, path };
}

/**
 * true si quien compra hoy recibe el libro y no el PDF marcador:
 * el texto está terminado y el archivo está configurado en Storage.
 * Se lee en el servidor; si cambian las variables, hay que volver a desplegar.
 */
export function isDeliveryReady(product: Product | undefined | null): boolean {
  if (!product || product.status !== "available") return true;
  return product.manuscriptReady && resolveProductStorage(product) !== null;
}

export function placeholderSlugs(slugs: readonly string[]): string[] {
  return slugs.filter((slug) => !isDeliveryReady(getProduct(slug)));
}
