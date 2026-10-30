export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }
  return value;
}

export function getSiteUrl(): string {
  return requireEnv("SITE_URL").replace(/\/$/, "");
}

export function getPriceArs(): number | null {
  const raw = process.env.PRICE_ARS?.trim();
  if (!raw || !/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) return null;
  return value;
}

export function getDownloadTtlHours(): number {
  const raw = process.env.DOWNLOAD_TTL_HOURS?.trim();
  if (!raw) return 72;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || value > 24 * 30) return 72;
  return value;
}

export function prefersSandboxCheckout(): boolean {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
  return token.startsWith("TEST-") || process.env.MERCADOPAGO_SANDBOX === "true";
}

export function getEbookStorage(): { bucket: string; path: string } | null {
  const bucket = process.env.EBOOK_STORAGE_BUCKET?.trim();
  const path = process.env.EBOOK_STORAGE_PATH?.trim();
  if (!bucket || !path) return null;
  return { bucket, path };
}

export function isHttpsUrl(url: string): boolean {
  return url.startsWith("https://");
}
