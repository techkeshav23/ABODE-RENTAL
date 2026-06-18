// Abode is a broker-free rental-homes marketplace: verified owners list directly,
// verified tenants contact them directly. No brokers, no middlemen.

export type VerificationStatus = "verified" | "pending" | "unverified";

export type Furnishing = "Furnished" | "Semi-furnished" | "Unfurnished";

export type TenantPreference = "Family" | "Bachelors" | "Anyone";

export type Owner = {
  id: string;
  name: string;
  since: number; // year the owner joined Abode
  verified: VerificationStatus; // identity + ownership KYC
  responseTime: string; // e.g. "Usually replies in 2 hours"
  listings: number;
};

export type Property = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  neighborhood: string;
  rent: number; // monthly rent in ₹
  deposit: number; // security deposit in ₹
  bedrooms: number;
  bathrooms: number;
  area: number; // carpet area in sq ft
  furnishing: Furnishing;
  preferredTenants: TenantPreference;
  availableFrom: string; // e.g. "Immediately" or "1 Aug 2026"
  rating: number;
  reviews: number;
  amenities: string[];
  images: string[];
  description: string;
  ownerId: string; // listings belong to exactly one verified owner — no broker
  highlights: string[];
  rules: string[];
  coordinates: { lat: number; lng: number };
  featured?: boolean;
};
