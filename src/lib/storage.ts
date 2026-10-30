import { FLAGSHIP_SLUG, type Product } from "@/content/products";

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
