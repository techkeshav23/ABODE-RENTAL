"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TIERS, TIER_LABEL } from "@/lib/tiers";

const AMENITIES = [
  "Wi-Fi",
  "AC",
  "Modular kitchen",
  "Washing machine",
  "Covered parking",
  "Power backup",
  "Lift",
  "Gated society",
  "Gym",
  "Swimming pool",
  "Balcony",
  "Garden",
];

const BHK = ["1", "2", "3"];
const FURNISHING = ["Furnished", "Semi-furnished", "Unfurnished"];

export function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [city, setCity] = useState(params.get("city") ?? "");
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");
  const [beds, setBeds] = useState(params.get("beds") ?? "");
  const [furnishing, setFurnishing] = useState(params.get("furnishing") ?? "");
  const [tier, setTier] = useState(params.get("tier") ?? "");
  const [amenities, setAmenities] = useState<string[]>(params.getAll("amenity"));

  useEffect(() => {
    setCity(params.get("city") ?? "");
    setMin(params.get("min") ?? "");
    setMax(params.get("max") ?? "");
    setBeds(params.get("beds") ?? "");
    setFurnishing(params.get("furnishing") ?? "");
    setTier(params.get("tier") ?? "");
    setAmenities(params.getAll("amenity"));
  }, [params]);

  const apply = () => {
    const sp = new URLSearchParams();
    if (city) sp.set("city", city);
    if (min) sp.set("min", min);
    if (max) sp.set("max", max);
    if (beds) sp.set("beds", beds);
    if (furnishing) sp.set("furnishing", furnishing);
    if (tier) sp.set("tier", tier);
    amenities.forEach((a) => sp.append("amenity", a));
    const sort = params.get("sort");
    if (sort) sp.set("sort", sort);
    router.push(`/stays?${sp.toString()}`);
  };

  const reset = () => {
    setCity("");
    setMin("");
    setMax("");
    setBeds("");
    setFurnishing("");
    setTier("");
    setAmenities([]);
    router.push("/stays");
  };

  const toggleAmenity = (a: string) =>
    setAmenities((curr) =>
      curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a]
    );

  return (
    <div className="bg-paper border border-line rounded-2xl p-5 md:p-6 lg:sticky lg:top-[72px]">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-[1.4rem]">Refine</h3>
        <button onClick={reset} className="text-[0.82rem] text-clay hover:underline">
          Clear all
        </button>
      </div>

      <Link
        href="/nearby"
        className="flex items-center justify-between gap-2 mb-1 px-3.5 py-3 rounded-xl bg-forest/5 border border-forest/20 text-forest hover:bg-forest/10 transition-colors"
      >
        <span className="inline-flex items-center gap-2 text-[0.9rem] font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Search on map (1–10 km)
        </span>
        <span aria-hidden>→</span>
      </Link>

      <Section title="Bedrooms">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={beds === ""} onClick={() => setBeds("")} label="Any" />
          {BHK.map((b) => (
            <Chip
              key={b}
              active={beds === b}
              onClick={() => setBeds(b)}
              label={`${b} BHK`}
            />
          ))}
        </div>
      </Section>

      <Section title={TIER_LABEL}>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={tier === ""} onClick={() => setTier("")} label="Any" />
          {TIERS.map((t) => (
            <Chip key={t} active={tier === t} onClick={() => setTier(t)} label={t} />
          ))}
        </div>
      </Section>

      <Section title="City">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city"
          className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.92rem] outline-none focus:border-ink"
        />
      </Section>

      <Section title="Monthly rent (₹)">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min"
            className="bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.92rem] outline-none focus:border-ink"
          />
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Max"
            className="bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.92rem] outline-none focus:border-ink"
          />
        </div>
      </Section>

      <Section title="Furnishing">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={furnishing === ""} onClick={() => setFurnishing("")} label="Any" />
          {FURNISHING.map((f) => (
            <Chip
              key={f}
              active={furnishing === f}
              onClick={() => setFurnishing(f)}
              label={f}
            />
          ))}
        </div>
      </Section>

      <Section title="Must have">
        <div className="flex flex-wrap gap-1.5">
          {AMENITIES.map((a) => (
            <Chip
              key={a}
              active={amenities.includes(a)}
              onClick={() => toggleAmenity(a)}
              label={a}
            />
          ))}
        </div>
      </Section>

      <button
        onClick={apply}
        className="w-full mt-2 bg-ink text-paper rounded-xl py-3 hover:bg-clay-deep transition-colors"
      >
        Show homes
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-t border-line-soft">
      <div className="text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[0.82rem] border transition-colors ${
        active
          ? "bg-ink text-paper border-ink"
          : "bg-paper text-ink-soft border-line hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}
