// Property tier labels are configurable via environment variables, so they can be
// renamed in the future WITHOUT touching code. For example, set in .env.local:
//   NEXT_PUBLIC_TIER_CLASSIC=Standard
//   NEXT_PUBLIC_TIER_PREMIUM=Elite
// and "Classic"/"Premium" become "Standard"/"Elite" everywhere — badges, filters,
// the home dropdown, the admin console and the API — after a dev-server restart.
//
// They MUST be prefixed NEXT_PUBLIC_ so the value is also available in the browser
// (client components like Filters / admin). Falls back to sensible defaults.

export const TIER_CLASSIC = process.env.NEXT_PUBLIC_TIER_CLASSIC?.trim() || "Classic";
export const TIER_PREMIUM = process.env.NEXT_PUBLIC_TIER_PREMIUM?.trim() || "Premium";

// A tier value is whichever label is configured (resolves to TIER_CLASSIC | TIER_PREMIUM).
export type Tier = string;

export const TIERS: Tier[] = [TIER_CLASSIC, TIER_PREMIUM];

export const isPremium = (t: string | undefined): boolean => t === TIER_PREMIUM;
