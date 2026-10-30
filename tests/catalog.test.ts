import { describe, expect, it } from "vitest";
import {
  filterProducts,
  parseLeadSource,
  resolvePaidProduct,
  resolvePriceArs,
  getFlagship,
} from "@/content/products";

describe("catálogo", () => {
  it("filtra por categoría y por texto", () => {
    expect(filterProducts({ categoria: "docentes" }).map((product) => product.slug)).toEqual(["ia-para-docentes"]);
    expect(filterProducts({ q: "tareas claras" }).map((product) => product.slug)).toEqual(["ia-para-reuniones"]);
    expect(filterProducts({ categoria: "inexistente", q: "" }).length).toBeGreaterThan(1);
  });

  it("solo cobra el ebook que está a la venta", () => {
    expect(
      resolvePaidProduct({
        productId: "ia-para-estudiar",
        externalReference: "ia-para-estudiar:abc",
      }),
    ).toBeNull();
    expect(
      resolvePaidProduct({
        productId: null,
        externalReference: "ia-para-docentes:abc",
      })?.slug,
    ).toBe("ia-para-docentes");
  });

  it("acepta avisos de los que todavía no salen y rechaza un slug inventado", () => {
    expect(parseLeadSource(undefined)).toBe("prompts-planificacion");
    expect(parseLeadSource("aviso-ia-para-escribir")).toBe("aviso-ia-para-escribir");
    expect(parseLeadSource("aviso-ia-para-docentes")).toBeNull();
    expect(parseLeadSource("aviso-no-existe")).toBeNull();
  });

  it("usa el precio de catálogo del destacado si no hay PRICE_ARS", () => {
    const previous = process.env.PRICE_ARS;
    delete process.env.PRICE_ARS;
    try {
      expect(resolvePriceArs(getFlagship())).toBe(12000);
    } finally {
      if (previous === undefined) delete process.env.PRICE_ARS;
      else process.env.PRICE_ARS = previous;
    }
  });
});
