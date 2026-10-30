"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ProductCard } from "@/components/store/product-card";
import { getProduct } from "@/content/products";

const key = "cerebrika-vistos";
const empty: string[] = [];
let cacheKey = "";
let cacheValue: string[] = empty;

function read(current: string): string[] {
  const raw = window.localStorage.getItem(key) ?? "[]";
  const stamp = `${current}:${raw}`;
  if (stamp === cacheKey) return cacheValue;
  cacheKey = stamp;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    cacheValue = list.filter((slug) => slug !== current && getProduct(slug));
  } catch {
    cacheValue = empty;
  }
  return cacheValue;
}

export function RememberView({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const slugs = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
      const next = [slug, ...slugs.filter((item) => item !== slug)].slice(0, 8);
      window.localStorage.setItem(key, JSON.stringify(next));
      cacheKey = "";
    } catch {
      /* si el navegador bloquea el almacenamiento, no hay vistos recientes */
    }
  }, [slug]);
  return null;
}

export function RecentlyViewed({ current }: { current: string }) {
  const slugs = useSyncExternalStore(
    () => () => {},
    () => read(current),
    () => empty,
  );
  const items = slugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-4xl font-bold tracking-[-0.045em]">Visto recién</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {items.map((product) => (
          <div key={product.slug} className="w-[280px] shrink-0">
            <ProductCard product={product} layout="tile" />
          </div>
        ))}
      </div>
    </section>
  );
}
