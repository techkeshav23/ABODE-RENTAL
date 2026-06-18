"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/geo";

export type MapPoint = {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  rent: number;
  distanceKm: number;
  coordinates: LatLng;
};

const shortPrice = (n: number) =>
  n >= 1000 ? `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `₹${n}`;

function pricePin(label: string, active: boolean) {
  const bg = active ? "#1a140d" : "#b8472d";
  return L.divIcon({
    className: "abode-price-pin",
    html: `<div style="background:${bg};color:#fbf8f3;font-weight:600;font-size:12px;
      padding:4px 9px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25);
      border:2px solid #fbf8f3;transform:translate(-50%,-50%)">${label}</div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
}

const centerPin = L.divIcon({
  className: "abode-center-pin",
  html: `<div style="width:18px;height:18px;border-radius:999px;background:#264d3d;
    border:3px solid #fbf8f3;box-shadow:0 0 0 6px rgba(38,77,61,.18)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Zoom/pan the map so the whole radius circle stays in view. */
function FitToRadius({ center, radiusKm }: { center: LatLng; radiusKm: number }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLng(center.lat, center.lng).toBounds(radiusKm * 2000);
    map.fitBounds(bounds, { padding: [40, 40], animate: true });
  }, [center.lat, center.lng, radiusKm, map]);
  return null;
}

export default function MapView({
  center,
  radiusKm,
  points,
  activeId,
  onSelect,
}: {
  center: LatLng;
  radiusKm: number;
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const icons = useMemo(
    () =>
      Object.fromEntries(
        points.map((p) => [p.id, pricePin(shortPrice(p.rent), p.id === activeId)])
      ),
    [points, activeId]
  );

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#f4ede0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToRadius center={center} radiusKm={radiusKm} />

      <Circle
        center={[center.lat, center.lng]}
        radius={radiusKm * 1000}
        pathOptions={{
          color: "#b8472d",
          weight: 1.5,
          fillColor: "#b8472d",
          fillOpacity: 0.08,
        }}
      />
      <Marker position={[center.lat, center.lng]} icon={centerPin} />

      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.coordinates.lat, p.coordinates.lng]}
          icon={icons[p.id]}
          eventHandlers={{ click: () => onSelect?.(p.id) }}
        >
          <Popup>
            <div style={{ minWidth: 150 }}>
              <strong>{p.name}</strong>
              <div style={{ color: "#6b5e50", fontSize: 12, margin: "2px 0" }}>
                {p.neighborhood} · {p.distanceKm.toFixed(1)} km away
              </div>
              <div style={{ fontWeight: 600 }}>{shortPrice(p.rent)}/mo</div>
              <a href={`/stays/${p.slug}`} style={{ color: "#b8472d", fontSize: 12 }}>
                View stay →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
