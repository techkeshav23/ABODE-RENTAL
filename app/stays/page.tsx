import { Suspense } from "react";
import { PROPERTIES, getTier } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";
import { Filters } from "@/components/Filters";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

type SearchParamsRaw = {
  q?: string;
  city?: string;
  min?: string;
  max?: string;
  beds?: string;
  furnishing?: string;
  tier?: string;
  amenity?: string | string[];
  sort?: string;
};

function filterAndSort(sp: SearchParamsRaw) {
  const q = sp.q?.toLowerCase().trim() ?? "";
  const city = sp.city?.toLowerCase().trim() ?? "";
  const min = Number(sp.min ?? 0);
  const max = Number(sp.max ?? Number.MAX_SAFE_INTEGER);
  const beds = sp.beds ? Number(sp.beds) : 0;
  const furnishing = sp.furnishing;
  const amenities = ([] as string[])
    .concat(sp.amenity ?? [])
    .map((a) => a.toLowerCase());

  let results = [...PROPERTIES];

  if (city) {
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(city) ||
        p.neighborhood.toLowerCase().includes(city)
    );
  }
  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }
  results = results.filter((p) => p.rent >= min && p.rent <= max);
  if (beds > 0) results = results.filter((p) => p.bedrooms === beds);
  if (furnishing) results = results.filter((p) => p.furnishing === furnishing);
  if (sp.tier) results = results.filter((p) => getTier(p) === sp.tier);
  if (amenities.length) {
    results = results.filter((p) =>
      amenities.every((a) => p.amenities.some((pa) => pa.toLowerCase().includes(a)))
    );
  }

  switch (sp.sort) {
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
  return results;
}

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRaw>;
}) {
  const sp = await searchParams;
  const results = filterAndSort(sp);

  return (
    <div className="bg-paper">
      <section className="pt-8 pb-6 border-b border-line">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-5 mb-6">
            <div>
              <div className="text-[0.7rem] uppercase tracking-[0.22em] text-clay mb-2">
                Rental homes
                {sp.city ? ` in ${sp.city}` : ""}
              </div>
              <h1 className="font-display text-[1.8rem] md:text-[2.4rem] leading-tight tracking-tight">
                {results.length} {results.length === 1 ? "home" : "homes"}
              </h1>
            </div>
            <div className="w-full md:max-w-md">
              <Suspense>
                <SearchBar variant="compact" />
              </Suspense>
            </div>
          </div>

          <ActiveChips sp={sp} />
        </div>
      </section>

      <section className="py-8 pb-24 md:pb-8">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <aside className="lg:col-span-3">
              <Suspense>
                <Filters />
              </Suspense>
            </aside>

            <div className="lg:col-span-9 min-w-0">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <p className="text-[0.9rem] text-ink-soft">
                  Showing {results.length} of {PROPERTIES.length} homes
                </p>
                <SortLinks current={sp.sort ?? "relevance"} sp={sp} />
              </div>

              {results.length === 0 ? (
                <div className="border border-dashed border-line rounded-2xl p-12 text-center">
                  <div className="font-display text-[1.4rem] mb-2">
                    No matches
                  </div>
                  <p className="text-ink-soft text-[0.95rem]">
                    Try removing a filter or{" "}
                    <Link href="/stays" className="text-clay underline">
                      reset everything
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
                  {results.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActiveChips({ sp }: { sp: SearchParamsRaw }) {
  const chips: { key: string; label: string }[] = [];
  if (sp.city) chips.push({ key: "city", label: sp.city });
  if (sp.min) chips.push({ key: "min", label: `Min ₹${sp.min}` });
  if (sp.max) chips.push({ key: "max", label: `Max ₹${sp.max}` });
  if (sp.beds) chips.push({ key: "beds", label: `${sp.beds} BHK` });
  if (sp.furnishing) chips.push({ key: "furnishing", label: sp.furnishing });
  if (sp.tier) chips.push({ key: "tier", label: `${sp.tier} tier` });
  const ams = ([] as string[]).concat(sp.amenity ?? []);
  ams.forEach((a) => chips.push({ key: `am-${a}`, label: a }));

  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-cream border border-line-soft rounded-full text-[0.82rem] text-ink"
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

function SortLinks({ current, sp }: { current: string; sp: SearchParamsRaw }) {
  const link = (sort: string) => {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
      if (k === "sort" || v === undefined) return;
      if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
      else params.set(k, String(v));
    });
    if (sort !== "relevance") params.set("sort", sort);
    return `/stays?${params.toString()}`;
  };

  const opts = [
    { v: "relevance", l: "Recommended" },
    { v: "rating", l: "Top rated" },
    { v: "rent-asc", l: "Rent low to high" },
    { v: "rent-desc", l: "Rent high to low" },
  ];

  return (
    <div className="flex items-center gap-1 text-[0.85rem] max-w-full overflow-x-auto no-scrollbar -mx-1 px-1">
      <span className="text-ink-faint mr-2 shrink-0">Sort:</span>
      {opts.map((o) => (
        <Link
          key={o.v}
          href={link(o.v)}
          className={`shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full ${
            current === o.v
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {o.l}
        </Link>
      ))}
    </div>
  );
}
