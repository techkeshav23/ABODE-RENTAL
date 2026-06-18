"use client";

import type { Furnishing, Property, Tier, VerificationStatus } from "./types";
import { PROPERTIES, OWNERS, getTier } from "./data";
import { isPremium } from "./tiers";
import { getRequests } from "./storage";

/* A demo admin data layer over localStorage. The public (server) pages still read
   the static PROPERTIES; here the admin can add listings, override tier/featured,
   hide listings and toggle owner verification. True multi-user real-time sync
   arrives with the database phase. */

const OV = "abode:admin:overrides"; // { [id]: { tier?, featured?, hidden? } }
const ADD = "abode:admin:added"; // Property[]
const OWN = "abode:admin:owners"; // { [ownerId]: VerificationStatus }
const AUTH = "abode:admin:auth";
const EVT = "abode:admin:changed";

export const ADMIN_PASSCODE = "admin123";

const isClient = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVT));
}

export type Override = { tier?: Tier; featured?: boolean; hidden?: boolean };
export type AdminListing = Property & { isAdded: boolean; hidden: boolean; tierResolved: Tier };

/* ─── auth ─── */
export function isAdminAuthed(): boolean {
  return isClient() && localStorage.getItem(AUTH) === "1";
}
export function adminLogin(pass: string): boolean {
  if (pass.trim() === ADMIN_PASSCODE) {
    localStorage.setItem(AUTH, "1");
    window.dispatchEvent(new Event(EVT));
    return true;
  }
  return false;
}
export function adminLogout() {
  if (!isClient()) return;
  localStorage.removeItem(AUTH);
  window.dispatchEvent(new Event(EVT));
}

/* ─── listings ─── */
export function getAdminListings(): AdminListing[] {
  const overrides = read<Record<string, Override>>(OV, {});
  const added = read<Property[]>(ADD, []);
  const base: (Property & { isAdded: boolean })[] = [
    ...added.map((p) => ({ ...p, isAdded: true })),
    ...PROPERTIES.map((p) => ({ ...p, isAdded: false })),
  ];
  return base.map((p) => {
    const ov = overrides[p.id] ?? {};
    const merged: Property = {
      ...p,
      ...(ov.tier ? { tier: ov.tier } : {}),
      ...(ov.featured !== undefined ? { featured: ov.featured } : {}),
    };
    return {
      ...merged,
      isAdded: p.isAdded,
      hidden: !!ov.hidden,
      tierResolved: ov.tier ?? getTier(p),
    };
  });
}

export function updateListing(id: string, patch: Override) {
  const overrides = read<Record<string, Override>>(OV, {});
  overrides[id] = { ...overrides[id], ...patch };
  write(OV, overrides);
}

export function removeListing(id: string) {
  const added = read<Property[]>(ADD, []);
  const i = added.findIndex((p) => p.id === id);
  if (i >= 0) {
    added.splice(i, 1);
    write(ADD, added);
  } else {
    updateListing(id, { hidden: true });
  }
}

export type NewListingInput = {
  name: string;
  city: string;
  neighborhood: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  furnishing: Furnishing;
  tier: Tier;
};

const kebab = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function addListing(input: NewListingInput) {
  const added = read<Property[]>(ADD, []);
  const rand = Math.random().toString(36).slice(2, 6);
  const id = `adm-${rand}`;
  const listing: Property = {
    id,
    slug: `${kebab(input.name) || "home"}-${rand}`,
    name: input.name,
    tagline: `${input.bedrooms} BHK in ${input.neighborhood}`,
    city: input.city,
    state: "",
    neighborhood: input.neighborhood,
    rent: input.rent,
    deposit: input.deposit,
    bedrooms: input.bedrooms,
    bathrooms: Math.max(1, input.bedrooms - 1) || 1,
    area: input.bedrooms * 450 + 200,
    furnishing: input.furnishing,
    preferredTenants: "Anyone",
    availableFrom: "Immediately",
    rating: 4.5,
    reviews: 0,
    amenities: ["Wi-Fi", "Covered parking", "Power backup"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80&auto=format&fit=crop",
    ],
    description: "Added via the Abode admin panel (demo).",
    ownerId: "o1",
    highlights: ["Newly listed"],
    rules: [],
    coordinates: { lat: 12.97, lng: 77.59 },
    tier: input.tier,
  };
  added.unshift(listing);
  write(ADD, added);
}

/* ─── owners ─── */
export type AdminOwner = {
  id: string;
  name: string;
  since: number;
  responseTime: string;
  listings: number;
  verified: VerificationStatus;
};
export function getAdminOwners(): AdminOwner[] {
  const ovs = read<Record<string, VerificationStatus>>(OWN, {});
  return OWNERS.map((o) => ({ ...o, verified: ovs[o.id] ?? o.verified }));
}
export function setOwnerVerified(id: string, v: VerificationStatus) {
  const ovs = read<Record<string, VerificationStatus>>(OWN, {});
  ovs[id] = v;
  write(OWN, ovs);
}

/* ─── stats ─── */
export function adminStats() {
  const listings = getAdminListings();
  const visible = listings.filter((l) => !l.hidden);
  const owners = getAdminOwners();
  const requests = getRequests();
  return {
    totalListings: visible.length,
    premium: visible.filter((l) => isPremium(l.tierResolved)).length,
    classic: visible.filter((l) => !isPremium(l.tierResolved)).length,
    owners: owners.length,
    verifiedOwners: owners.filter((o) => o.verified === "verified").length,
    requests: requests.length,
    openRequests: requests.filter((r) => r.status !== "cancelled").length,
  };
}

/* ─── change subscription ─── */
export function onAdminChange(handler: () => void) {
  if (!isClient()) return () => {};
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}
