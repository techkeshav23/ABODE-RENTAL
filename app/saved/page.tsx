"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROPERTIES } from "@/lib/data";
import type { Property } from "@/lib/types";
import { getFavorites, onFavoritesChange, toggleFavorite } from "@/lib/storage";
import { PropertyCard } from "@/components/PropertyCard";

export default function SavedPage() {
  const [items, setItems] = useState<Property[] | null>(null);

  useEffect(() => {
    const refresh = () => {
      const slugs = getFavorites();
      setItems(slugs.map((s) => PROPERTIES.find((p) => p.slug === s)).filter(Boolean) as Property[]);
    };
    refresh();
    return onFavoritesChange(refresh);
  }, []);

  return (
    <div className="bg-paper">
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10 py-7 sm:py-10 md:py-14">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="min-w-0">
              <div className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] text-clay mb-2">
                Wishlist
              </div>
              <h1 className="font-display text-[1.7rem] sm:text-[2.2rem] md:text-[2.8rem] leading-tight tracking-tight">
                Saved homes
              </h1>
              <p className="mt-2 text-[0.92rem] sm:text-[0.98rem] text-ink-soft max-w-md">
                Tap the heart on any home to save it here. Compare rents and decide later.
              </p>
            </div>
            {items && items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all saved homes?")) {
                    items.forEach((p) => toggleFavorite(p.slug));
                  }
                }}
                className="text-[0.82rem] sm:text-[0.85rem] text-clay hover:underline shrink-0"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 md:py-14">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-5 lg:px-10">
          {items === null ? (
            <div className="text-ink-soft">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cream flex items-center justify-center mb-5 sm:mb-6">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-clay)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7.5-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2 4.5-9.5 9-9.5 9z" />
                </svg>
              </div>
              <div className="font-display text-[1.4rem] sm:text-[1.8rem] mb-2">
                Nothing saved yet
              </div>
              <p className="text-ink-soft max-w-sm mx-auto mb-6 sm:mb-7 text-[0.92rem] sm:text-[0.98rem]">
                Tap the heart on any home to save it here.
              </p>
              <Link
                href="/stays"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-ink text-paper rounded-full hover:bg-clay-deep transition text-[0.9rem] sm:text-[0.95rem]"
              >
                Browse homes
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[0.88rem] sm:text-[0.92rem] text-ink-soft mb-5 sm:mb-6">
                {items.length} {items.length === 1 ? "home" : "homes"} saved
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
                {items.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
