"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const POPULAR = ["Bengaluru", "Mumbai", "Pune", "New Delhi", "Gurugram", "Hyderabad", "Chennai"];
const BHK = [
  { v: "", l: "Any size" },
  { v: "1", l: "1 BHK" },
  { v: "2", l: "2 BHK" },
  { v: "3", l: "3 BHK" },
];

export function SearchBar({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState("");
  const [showCities, setShowCities] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (beds) params.set("beds", beds);
    router.push(`/stays?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 bg-paper border border-line rounded-full px-2 py-1.5 shadow-sm"
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city or area"
          className="flex-1 bg-transparent px-3 py-2 text-[0.92rem] outline-none placeholder:text-ink-faint"
        />
        <button className="px-5 py-2 bg-clay text-paper rounded-full text-[0.88rem] hover:bg-clay-deep transition">
          Search
        </button>
      </form>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="bg-paper border border-line rounded-2xl shadow-[0_8px_28px_-12px_rgba(26,20,13,0.18)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-line-soft">
          <div className="relative px-5 py-4">
            <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-ink-faint mb-1.5">
              Where
            </label>
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowCities(true);
              }}
              onFocus={() => setShowCities(true)}
              onBlur={() => setTimeout(() => setShowCities(false), 150)}
              placeholder="City or neighbourhood"
              className="w-full bg-transparent text-[1.05rem] outline-none placeholder:text-ink-faint/70"
            />
            {showCities && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-paper border border-line rounded-xl shadow-xl py-2 z-20">
                <div className="px-4 pt-1 pb-2 text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
                  Popular cities
                </div>
                {POPULAR.filter((c) =>
                  c.toLowerCase().includes(city.toLowerCase())
                ).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCity(c);
                      setShowCities(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-cream text-[0.95rem]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="px-5 py-4 flex flex-col justify-center">
            <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-ink-faint mb-1.5">
              Size
            </span>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="w-full bg-transparent text-[1.05rem] outline-none"
            >
              {BHK.map((b) => (
                <option key={b.v} value={b.v}>
                  {b.l}
                </option>
              ))}
            </select>
          </label>

          <div className="p-3 flex items-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-clay hover:bg-clay-deep text-paper rounded-xl px-7 py-4 inline-flex items-center justify-center gap-2 transition-colors group"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="transition-transform group-hover:rotate-12"
              >
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span className="text-[0.95rem] font-medium">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
