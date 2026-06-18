export type LatLng = { lat: number; lng: number };

/**
 * Great-circle distance between two points in kilometres (Haversine).
 * Pure + dependency-free so it works on both server and client, and is the
 * same primitive that later powers duplicate-listing detection.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371; // Earth radius in km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** True if `point` lies within `km` of `center`. */
export function withinRadius(point: LatLng, center: LatLng, km: number): boolean {
  return haversineKm(point, center) <= km;
}

export type CityCenter = { name: string; center: LatLng };

/**
 * Quick centre points so the demo works reliably even when browser
 * geolocation is denied or unavailable (e.g. a desktop with no GPS).
 */
export const CITY_CENTERS: CityCenter[] = [
  { name: "Bengaluru", center: { lat: 12.95, lng: 77.62 } },
  { name: "Mumbai", center: { lat: 19.09, lng: 72.87 } },
  { name: "Pune", center: { lat: 18.53, lng: 73.8 } },
  { name: "New Delhi", center: { lat: 28.54, lng: 77.2 } },
  { name: "Gurugram", center: { lat: 28.44, lng: 77.1 } },
  { name: "Hyderabad", center: { lat: 17.41, lng: 78.45 } },
  { name: "Chennai", center: { lat: 13.04, lng: 80.25 } },
];

export const DEFAULT_CENTER: LatLng = CITY_CENTERS[0].center; // Bengaluru
export const RADIUS_MIN_KM = 1;
export const RADIUS_MAX_KM = 10;
export const RADIUS_DEFAULT_KM = 5;
