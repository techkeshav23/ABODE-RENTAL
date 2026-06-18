import { NextResponse } from "next/server";
import { PROPERTIES, getTier } from "@/lib/data";
import { TIERS } from "@/lib/tiers";
import type { Property, Furnishing } from "@/lib/types";

const FURNISHINGS: Furnishing[] = ["Furnished", "Semi-furnished", "Unfurnished"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const city = searchParams.get("city")?.toLowerCase().trim() ?? "";
  const min = Number(searchParams.get("min") ?? 0);
  const max = Number(searchParams.get("max") ?? Number.MAX_SAFE_INTEGER);
  const beds = searchParams.get("beds");
  const furnishingParam = searchParams.get("furnishing");
  const furnishing = FURNISHINGS.find((f) => f === furnishingParam) ?? null;
  const amenities = searchParams.getAll("amenity").map((a) => a.toLowerCase());
  const sort = searchParams.get("sort") ?? "relevance";

  let results: Property[] = [...PROPERTIES];

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q)
    );
  }
  if (city) {
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(city) ||
        p.neighborhood.toLowerCase().includes(city)
    );
  }

  results = results.filter((p) => p.rent >= min && p.rent <= max);

  if (beds) {
    const n = Number(beds);
    results = results.filter((p) => p.bedrooms === n);
  }

  if (furnishing) {
    results = results.filter((p) => p.furnishing === furnishing);
  }

  const tier = searchParams.get("tier");
  if (tier && TIERS.includes(tier)) {
    results = results.filter((p) => getTier(p) === tier);
  }

  if (amenities.length) {
    results = results.filter((p) =>
      amenities.every((a) =>
        p.amenities.some((pa) => pa.toLowerCase().includes(a))
      )
    );
  }

  switch (sort) {
    case "rent-asc":
      results.sort((a, b) => a.rent - b.rent);
      break;
    case "rent-desc":
      results.sort((a, b) => b.rent - a.rent);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    default:
      results.sort(
        (a, b) =>
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating
      );
  }

  return NextResponse.json({ count: results.length, results });
}
