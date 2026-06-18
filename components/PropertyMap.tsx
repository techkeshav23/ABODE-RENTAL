"use client";

import dynamic from "next/dynamic";
import type { LatLng } from "@/lib/geo";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-cream text-ink-faint text-sm">
      Loading map…
    </div>
  ),
});

export function PropertyMap({
  name,
  neighborhood,
  rent,
  coordinates,
}: {
  name: string;
  neighborhood: string;
  rent: number;
  coordinates: LatLng;
}) {
  return (
    <MapView
      center={coordinates}
      radiusKm={0.7}
      points={[
        {
          id: "this",
          slug: "",
          name,
          neighborhood,
          rent,
          distanceKm: 0,
          coordinates,
        },
      ]}
    />
  );
}
