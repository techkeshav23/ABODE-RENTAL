"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PROPERTIES, getOwner } from "@/lib/data";
import {
  haversineKm,
  CITY_CENTERS,
  DEFAULT_CENTER,
  RADIUS_MIN_KM,
  RADIUS_MAX_KM,
  RADIUS_DEFAULT_KM,
  type LatLng,
} from "@/lib/geo";
import type { MapPoint } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-cream text-ink-faint text-sm">
      Loading map…
    </div>
  ),
});

const formatPrice = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function NearbyExplorer() {
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [radiusKm, setRadiusKm] = useState(RADIUS_DEFAULT_KM);
  const [activeCity, setActiveCity] = useState("Bengaluru");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "denied">("idle");

  const results = useMemo(() => {
    return PROPERTIES.map((p) => ({
      property: p,
      distanceKm: haversineKm(center, p.coordinates),
    }))
      .filter((r) => r.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [center, radiusKm]);

  const points: MapPoint[] = useMemo(
    () =>
      results.map(({ property, distanceKm }) => ({
        id: property.id,
        slug: property.slug,
        name: property.name,
        neighborhood: property.neighborhood,
        rent: property.rent,
        distanceKm,
        coordinates: property.coordinates,
      })),
    [results]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setActiveCity("My location");
        setGeoStatus("idle");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const pickCity = (name: string, c: LatLng) => {
    setCenter(c);
    setActiveCity(name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
      {/* Left: controls + results */}
      <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-4">
        {/* Center selector */}
        <div className="bg-paper border border-line rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-3">
            <div className="text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
              Search around
            </div>
            <button
              onClick={useMyLocation}
              className="inline-flex items-center gap-1.5 text-[0.82rem] text-clay hover:text-clay-deep"
            >
              <LocateIcon />
              {geoStatus === "loading" ? "Locating…" : "Use my location"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-1">
            {CITY_CENTERS.map((c) => (
              <button
                key={c.name}
                onClick={() => pickCity(c.name, c.center)}
                className={`px-3 py-1.5 rounded-full text-[0.82rem] border transition-colors ${
                  activeCity === c.name
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink-soft border-line hover:border-ink"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          {geoStatus === "denied" && (
            <p className="text-[0.78rem] text-ink-faint mt-2">
              Location unavailable — pick a city above.
            </p>
          )}

          {/* Radius slider */}
          <div className="mt-5 pt-4 border-t border-line-soft">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
                Distance
              </span>
              <span className="font-display text-[1.15rem] text-ink">
                Within {radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min={RADIUS_MIN_KM}
              max={RADIUS_MAX_KM}
              step={1}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-clay"
            />
            <div className="flex justify-between text-[0.72rem] text-ink-faint mt-1">
              <span>{RADIUS_MIN_KM} km</span>
              <span>max {RADIUS_MAX_KM} km</span>
            </div>
          </div>
        </div>

        {/* Result count + trust line */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-[0.9rem] text-ink-soft">
            <span className="font-medium text-ink">{results.length}</span>{" "}
            {results.length === 1 ? "stay" : "stays"} within {radiusKm} km of{" "}
            {activeCity}
          </p>
        </div>

        {/* Results list */}
        <div className="space-y-3 lg:max-h-[calc(100vh-360px)] lg:overflow-y-auto lg:pr-1 no-scrollbar">
          {results.length === 0 ? (
            <div className="border border-dashed border-line rounded-2xl p-8 text-center">
              <div className="font-display text-[1.2rem] mb-1">Nothing in range</div>
              <p className="text-ink-soft text-[0.9rem]">
                Drag the slider up to {RADIUS_MAX_KM} km or pick another city.
              </p>
            </div>
          ) : (
            results.map(({ property, distanceKm }) => {
              const owner = getOwner(property.ownerId);
              return (
                <ResultCard
                  key={property.id}
                  slug={property.slug}
                  image={property.images[0]}
                  name={property.name}
                  neighborhood={property.neighborhood}
                  city={property.city}
                  ownerName={owner?.name ?? "Owner"}
                  verified={owner?.verified === "verified"}
                  price={formatPrice(property.rent)}
                  distanceKm={distanceKm}
                  active={activeId === property.id}
                  onHover={() => setActiveId(property.id)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Right: map */}
      <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-8">
        <div className="relative h-[55vh] min-h-[320px] lg:h-[calc(100vh-160px)] lg:sticky lg:top-[72px] rounded-2xl overflow-hidden border border-line">
          <MapView
            center={center}
            radiusKm={radiusKm}
            points={points}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  slug,
  image,
  name,
  neighborhood,
  city,
  ownerName,
  verified,
  price,
  distanceKm,
  active,
  onHover,
}: {
  slug: string;
  image: string;
  name: string;
  neighborhood: string;
  city: string;
  ownerName: string;
  verified: boolean;
  price: string;
  distanceKm: number;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <Link
      href={`/stays/${slug}`}
      onMouseEnter={onHover}
      className={`flex gap-3 p-3 rounded-2xl border transition-colors ${
        active ? "border-ink bg-cream/50" : "border-line hover:border-ink/40"
      }`}
    >
      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-cream-deep">
        <Image src={image} alt={name} fill sizes="96px" className="object-cover" />
        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-ink/85 text-paper text-[0.62rem] rounded-md tabular-nums">
          {distanceKm.toFixed(1)} km
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[1.02rem] leading-snug text-ink line-clamp-1">
          {name}
        </h3>
        <div className="text-[0.8rem] text-ink-soft line-clamp-1">
          {neighborhood} · {city}
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-[0.74rem]">
          {verified ? (
            <>
              <VerifiedIcon />
              <span className="text-ink-soft">
                {ownerName} ·{" "}
                <span className="text-forest font-medium">Verified owner</span>
              </span>
            </>
          ) : (
            <span className="text-ink-faint">{ownerName} · Verification pending</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-display text-[1.02rem] text-ink">
            {price}
            <span className="text-[0.72rem] text-ink-faint font-sans">/mo</span>
          </span>
          <span className="text-[0.72rem] text-clay">Message owner →</span>
        </div>
      </div>
    </Link>
  );
}

function LocateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#264d3d">
      <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.5l1-3-1-3 2.6-1.9 1-3 3.2.2z" />
      <path d="M8.5 12l2.3 2.3 4.2-4.6" stroke="#fbf8f3" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
