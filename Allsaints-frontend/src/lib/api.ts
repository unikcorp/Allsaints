/**
 * api.ts
 * Central API layer — switches between Strapi CMS and static constants.
 * When NEXT_PUBLIC_API_URL is set, fetch from Strapi; otherwise fall back
 * to the local constants so the site works without a running backend.
 */

import type { NewsItem, Testimonial, Facility } from "@/types";
import { NEWS_ITEMS, TESTIMONIALS, FACILITIES } from "@/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Generic Strapi fetcher ───────────────────────────────────────────────────
async function strapiGet<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/${path}?populate=*`, {
      next: { revalidate: 60 },      // ISR — revalidate every 60 s
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json as T;
  } catch (err) {
    console.error("[API]", err);
    return null;
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNewsItems(limit = 3): Promise<NewsItem[]> {
  const data = await strapiGet<{ data: { id: number; attributes: Omit<NewsItem, "id"> }[] }>(
    `news-items?sort=date:desc&pagination[limit]=${limit}`
  );
  if (data?.data) {
    return data.data.map((d) => ({ ...d.attributes, id: d.id }));
  }
  return NEWS_ITEMS.slice(0, limit);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await strapiGet<{ data: { id: number; attributes: Omit<Testimonial, "id"> }[] }>(
    "testimonials"
  );
  if (data?.data) {
    return data.data.map((d) => ({ ...d.attributes, id: d.id }));
  }
  return TESTIMONIALS;
}

// ─── Facilities ───────────────────────────────────────────────────────────────
export async function getFacilities(): Promise<Facility[]> {
  const data = await strapiGet<{ data: { id: number; attributes: Omit<Facility, "id"> }[] }>(
    "facilities"
  );
  if (data?.data) {
    return data.data.map((d) => ({ ...d.attributes, id: d.id }));
  }
  return FACILITIES;
}
