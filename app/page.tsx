"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROPERTIES, CITIES } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";

const SORT_OPTIONS = [
  { v: "relevance", l: "Recommended" },
  { v: "rating", l: "Top rated" },
  { v: "rent-asc", l: "Rent: low to high" },
  { v: "rent-desc", l: "Rent: high to low" },
];

const RENT_BUCKETS = [
  { v: "", l: "Any rent" },
  { v: "0-35000", l: "Under ₹35k" },
  { v: "35000-50000", l: "₹35k–50k" },
  { v: "50000-75000", l: "₹50k–75k" },
  { v: "75000-", l: "Above ₹75k" },
];

const QUICK_CHIPS = [
  { l: "On the map", q: "/nearby" },
  { l: "2 BHK", q: "/stays?beds=2" },
  { l: "3 BHK", q: "/stays?beds=3" },
  { l: "Furnished", q: "/stays?furnishing=Furnished" },
  { l: "Bengaluru", q: "/stays?city=Bengaluru" },
  { l: "Mumbai", q: "/stays?city=Mumbai" },
];

export default function HomePage() {
  const [city, setCity] = useState("");
  const [rentRange, setRentRange] = useState("");
  const [sort, setSort] = useState("relevance");

  const results = useMemo(() => {
    let r = [...PROPERTIES];
    if (city) r = r.filter((p) => p.city === city);
    if (rentRange) {
      const [min, max] = rentRange.split("-").map(Number);
      r = r.filter(
        (p) => p.rent >= (min || 0) && p.rent <= (max || Number.MAX_SAFE_INTEGER)
      );
    }
    switch (sort) {
      case "rent-asc":
        r.sort((a, b) => a.rent - b.rent);
        break;
      case "rent-desc":
        r.sort((a, b) => b.rent - a.rent);
        break;
      case "rating":
        r.sort((a, b) => b.rating - a.rating);
        break;
      default:
        r.sort(
          (a, b) =>
            (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating
        );
    }
    return r;
  }, [city, rentRange, sort]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-cream/30">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-8 pt-10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge>Zero brokerage</Badge>
            <Badge>Verified owners</Badge>
            <Badge>Verified tenants</Badge>
            <Badge>Search by distance</Badge>
          </div>
          <h1 className="font-display text-[1.75rem] sm:text-[2rem] md:text-[3rem] leading-[1.1] md:leading-[1.05] tracking-tight max-w-3xl">
            Rent directly from verified owners.
            <span className="text-clay"> No brokers.</span>
          </h1>
          <p className="text-[1rem] text-ink-soft mt-3 max-w-xl">
            Rental homes across India — talk to the owner directly, pick a place on
            the map within your radius, and skip the middleman entirely.
          </p>
          <div className="mt-6 max-w-3xl">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Quick chips */}
      <section className="border-b border-line-soft">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {QUICK_CHIPS.map((c) => (
            <Link
              key={c.l}
              href={c.q}
              className="px-3 py-1.5 bg-paper border border-line rounded-full text-[0.82rem] hover:border-ink whitespace-nowrap transition-colors"
            >
              {c.l}
            </Link>
          ))}
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-paper/95 backdrop-blur-lg border-b border-line sticky top-[116px] md:top-[64px] z-30">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <FilterDropdown
            label="City"
            value={city}
            onChange={setCity}
            options={[{ v: "", l: "Any city" }, ...CITIES.map((c) => ({ v: c, l: c }))]}
          />
          <FilterDropdown
            label="Rent"
            value={rentRange}
            onChange={setRentRange}
            options={RENT_BUCKETS}
          />
          <Link
            href="/nearby"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/25 text-forest text-[0.85rem] hover:bg-forest/15 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Map search
          </Link>
          <div className="ml-auto shrink-0">
            <FilterDropdown
              label="Sort"
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-8">
          <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="font-display text-[1.6rem] md:text-[1.9rem] leading-tight">
                {city ? `Rental homes in ${city}` : "All rental homes"}
              </h2>
              <p className="text-[0.88rem] text-ink-soft mt-0.5">
                {results.length} of {PROPERTIES.length} homes · monthly rent in INR
              </p>
            </div>
            <Link
              href="/stays"
              className="text-[0.88rem] text-clay hover:underline whitespace-nowrap"
            >
              Advanced filters
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="border border-dashed border-line rounded-2xl p-8 md:p-16 text-center">
              <div className="font-display text-[1.6rem] mb-2">No homes match.</div>
              <button
                onClick={() => {
                  setCity("");
                  setRentRange("");
                  setSort("relevance");
                }}
                className="text-clay underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust band */}
      <section className="py-12 bg-cream/40 border-t border-line">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Trust title="No brokers, ever" body="Listings come straight from owners. The rent you see is the rent you pay — zero brokerage." />
          <Trust title="Verified owners" body="Every owner clears identity and ownership checks before a home goes live." />
          <Trust title="Verified tenants" body="Tenants verify their ID too, so owners know exactly who is visiting." />
          <Trust title="Search by distance" body="Drop a pin, pick a 1–10 km radius, and see only the homes near you." />
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-paper border border-line rounded-full text-[0.78rem] text-ink-soft">
      <span className="w-1.5 h-1.5 rounded-full bg-forest" />
      {children}
    </span>
  );
}

function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="relative inline-flex items-center bg-paper border border-line rounded-full pl-3.5 pr-2 py-1.5 hover:border-ink shrink-0">
      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint mr-2">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent text-[0.85rem] outline-none pr-5"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      <svg className="absolute right-2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

function Trust({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-display text-[1.05rem] mb-1">{title}</div>
      <p className="text-[0.85rem] text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
