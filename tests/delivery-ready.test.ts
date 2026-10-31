import { afterEach, describe, expect, it } from "vitest";
import { getFlagship, getProduct } from "@/content/products";
import { isDeliveryReady, placeholderSlugs } from "@/lib/storage";

const saved = { bucket: process.env.EBOOK_STORAGE_BUCKET, path: process.env.EBOOK_STORAGE_PATH };

afterEach(() => {
  process.env.EBOOK_STORAGE_BUCKET = saved.bucket;
  process.env.EBOOK_STORAGE_PATH = saved.path;
});

describe("entrega lista", () => {
  it("sin el PDF en Storage, el destacado entrega el marcador y lo avisa", () => {
    delete process.env.EBOOK_STORAGE_BUCKET;
    delete process.env.EBOOK_STORAGE_PATH;
    expect(isDeliveryReady(getFlagship())).toBe(false);
    expect(placeholderSlugs([getFlagship().slug])).toEqual([getFlagship().slug]);
  });

  it("con el bucket configurado, entrega el libro y el aviso se apaga", () => {
    process.env.EBOOK_STORAGE_BUCKET = "ebooks";
    process.env.EBOOK_STORAGE_PATH = "ia-para-docentes.pdf";
    expect(isDeliveryReady(getFlagship())).toBe(true);
    expect(placeholderSlugs([getFlagship().slug])).toEqual([]);
  });

  it("un ebook que no está a la venta no muestra el aviso", () => {
    expect(isDeliveryReady(getProduct("ia-para-el-mail"))).toBe(true);
  });
});
