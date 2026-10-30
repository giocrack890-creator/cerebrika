import { describe, expect, it } from "vitest";
import { selectTestimonials, site, type Testimonial } from "@/content/site";

const real: Testimonial = {
  id: "real-1",
  placeholder: false,
  tag: "Primaria",
  quote: "Una frase que alguien escribió de verdad.",
  name: "Nombre real",
  role: "Docente",
};

describe("testimonios", () => {
  it("oculta los placeholders en producción", () => {
    expect(selectTestimonials(site.testimonials, "production")).toEqual([]);
  });

  it("muestra la maqueta fuera de producción", () => {
    expect(selectTestimonials(site.testimonials, "development").length).toBeGreaterThan(0);
    expect(selectTestimonials(site.testimonials, "development").every((item) => item.placeholder)).toBe(true);
  });

  it("en producción deja solo las opiniones marcadas como reales", () => {
    const visible = selectTestimonials([...site.testimonials, real], "production");
    expect(visible).toEqual([real]);
  });
});
