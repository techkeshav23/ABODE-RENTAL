# Basera → Direct, Verified, Geo-Radius Rental Marketplace

**Client-ready change plan.** Goal: transform the static `basera` rental site into a
**broker-free, identity-verified, location-aware** rental marketplace.

The three client requirements:
1. **Cut out the broker / middleman** — direct owner ↔ tenant connection.
2. **Verified owners and tenants** — KYC / identity verification with trust badges.
3. **Map radius filter** — show properties within a chosen radius (default 5 km, max 10 km).

---

## 1. Where the project stands today

`basera` is a polished but **fully static** Next.js 15 (App Router) site for PGs, rental homes,
hotels and villas across India.

- All **32 listings are hard-coded** in [lib/data.ts](lib/data.ts) as a `Property[]` array.
- **No database, no real auth, no persistence.** `/login` and `/signup` forms have no working
  submit; the profile page shows a hard-coded "Guest user" in "Guest mode"; bookings/favorites
  live only in the browser via [lib/storage.ts](lib/storage.ts) (localStorage).
- The app is currently **broker-shaped**: a listing's "host" is an anonymous `{ name, since }`
  blob ([lib/types.ts](lib/types.ts) lines 24–27), the [app/host/page.tsx](app/host/page.tsx)
  page markets *"List your property. Skip the brokers. Basera handles photography, screening and
  paperwork"* while itself acting as the intermediary, and it exposes **one shared phone number
  (`+91 80 4567 8910`)** as the contact path.
- Properties **already carry `coordinates {lat,lng}`** — so the geo feature is the cheapest win.

---

## 2. Architecture shift (the foundation everything depends on)

Two foundational changes must land **before** the three requirements, because all three assume
things the app does not have:

### a) Real authentication + roles
- Adopt **Auth.js v5 (`next-auth@beta`)** — Credentials (email-or-phone + password, matching the
  existing `/login`) + Google OAuth (the button already exists).
- Role enum is **exactly `OWNER | TENANT | ADMIN`** — **no `BROKER` value anywhere**, in the DB,
  the TypeScript union, or the UI.
- New `auth.ts` (session), `middleware.ts` (gate `/host/**` to OWNER, contact actions to TENANT),
  and a `<SessionProvider>` in [app/layout.tsx](app/layout.tsx) so
  [components/Header.tsx](components/Header.tsx) and [app/profile/page.tsx](app/profile/page.tsx)
  show the real user.

### b) A real database
- Move to **managed Postgres** — recommended **Supabase** (Postgres + **PostGIS** for true
  geo-radius queries + **Storage** for KYC docs + **Row-Level Security** to enforce "only verified
  owners list" / "owner_id is immutable" at the DB layer).
- Migrate **incrementally and non-breaking** via a new `lib/repository.ts` seam
  (`getProperties()`, `getPropertyBySlug()`, `getCities()`) that first returns the existing
  `lib/data.ts` array, then swaps its internals to DB queries — so the ~10 files importing
  `PROPERTIES`/`CITIES` change only their import line.
- The four `generateStaticParams` routes move to **ISR** (`export const revalidate`).
  *(Verified safe: [next.config.ts](next.config.ts) has no `output: 'export'`, so middleware /
  ISR / Server Actions / webhooks are all usable.)*

> **Why first:** broker-removal and verification are *no-ops* without a server-side identity to
> bind ownership to and gate actions against. The geo-radius filter is the one requirement that
> can ship *before* the DB (the 32 properties already have coordinates), so it leads the roadmap
> as an early, visible win.

---

## 3. The three client requirements

### Requirement 1 — Cut out the broker (direct owner ↔ tenant)

Replace the anonymous "host" + shared phone number with a real owner account that owns the
listing, and replace the "host will reach out" hand-off with an **in-app enquiry thread**.

- [lib/types.ts](lib/types.ts): change `Property.host` from `{name, since}` to **`ownerId: string`**;
  add `Owner { id, displayName, since, verificationStatus }` (phone/email/KYC live only in a
  **server-only private record**, never in client types); add `Enquiry` and `Message` types; add a
  `listingFingerprint` (normalized address + geo hash) for duplicate detection.
- [lib/data.ts](lib/data.ts): convert each of the 32 entries from `host` to `ownerId` + seed an
  owners list from the current host names.
- New Server Actions: `createListing` (verified-owner gate + duplicate detection via address
  fingerprint and Haversine proximity), `createEnquiry`, `sendMessage`.
- [app/host/page.tsx](app/host/page.tsx): **near-total rewrite** — remove the fake `setSent(true)`,
  delete the `+91 80 4567 8910` block and the "Skip the brokers / Basera handles screening / 5%
  commission" framing; make it a real owner-only listing-create flow.
- [app/stays/[id]/page.tsx](app/stays/[id]/page.tsx): replace "Hosted by {property.host.name}"
  (lines 109–117) with a new `components/OwnerCard.tsx` (verified badge + "Message owner" CTA), and
  **also delete the SECOND hardcoded `+91 80 4567 8910`** in the "Need help booking? Call…" aside
  (around line 251).
- [app/book/[id]/confirm/ConfirmView.tsx](app/book/[id]/confirm/ConfirmView.tsx): change "the host
  will reach out" to a **"Message your host"** link into the enquiry thread.
- [app/api/properties/route.ts](app/api/properties/route.ts) and
  [app/api/properties/[id]/route.ts](app/api/properties/[id]/route.ts): include owner verification
  status, **never** serialize phone/email.
- **New UI:** `/messages` inbox + `/messages/[enquiryId]` thread; `app/host/dashboard/page.tsx`;
  a composer warning when a message contains a phone/email pattern ("keep chats on Basera").
- **Libraries:** none strictly new beyond the DB. Optional `zod` (validation + phone-pattern
  stripping), `nanoid` (IDs, mirroring the existing `newBookingId`).

### Requirement 2 — Verified owners & tenants (KYC)

Owners prove identity **and** property ownership; tenants prove identity. Until verified, owners
can't list and tenants can't contact. Docs stored securely off the main DB; UI shows only masked
data + a trust badge.

- New `Verification` model: `{ kind: 'owner_kyc' | 'tenant_kyc' | 'ownership_proof', status:
  'unverified'|'pending'|'verified'|'rejected', provider, providerRef, documents[], maskedIdLast4,
  verifiedName, reviewedBy, timestamps }`. DB stores **only storage keys + masked metadata**, never
  raw ID bytes.
- New `lib/verification.ts`: server-side single source of truth — `requireVerifiedOwner()`,
  `requireVerifiedTenant()`, `getVerificationStatus()`, `mask()` — called from `middleware.ts` and
  the create-actions, so gating is **server-enforced, not client-hidden**.
- New `/verify` hub → `app/verify/owner/page.tsx` (ID + ownership proof) and
  `app/verify/tenant/page.tsx` (ID), driven by a `VerifyFlow.tsx` stepper with consent capture.
- New `components/VerifiedBadge.tsx` (forest = verified, saffron = pending, neutral = none) reused
  on [components/PropertyCard.tsx](components/PropertyCard.tsx), `OwnerCard`,
  [components/Header.tsx](components/Header.tsx), [app/profile/page.tsx](app/profile/page.tsx).
- API: `app/api/verification/route.ts`, `.../upload/route.ts` (short-lived signed upload URL),
  `.../webhook/route.ts` (signature-verified provider callback flipping pending → verified/rejected).
- Admin queue at `app/admin/verifications/page.tsx` (ADMIN only) for **manual** ownership-proof
  review — no API can reliably validate a sale deed or electricity bill.
- **Libraries/services:** an **Indian KYC provider** (Digio / Hyperverge / Signzy — Aadhaar
  offline/DigiLocker, PAN, liveness, OCR); **private object storage** (Supabase Storage, or AWS S3
  via `@aws-sdk/client-s3` + presigner); `zod`. Privacy via data-minimization, encryption at rest,
  masked UI, explicit consent, and a documented retention policy aligned to India's **DPDP Act**.

### Requirement 3 — Map radius filter

A "Near me" control lets the user use GPS or search a place, pick a radius on a slider, and see
only properties inside that circle — on a real map plus the existing cards. **No data backfill
needed.**

- New `lib/geo.ts`: pure `haversineKm(a, b)` and `withinRadius(point, center, km)` — shared with
  Requirement 1's duplicate detection. (Swapped for indexed **PostGIS `ST_DWithin`** when the DB
  lands — but kept client-side for the map circle, so it's a **dual path**, not a replacement.)
- New `lib/filter.ts`: extract the filter/sort logic that currently lives in **both**
  [app/stays/page.tsx](app/stays/page.tsx) (lines 21–74) and
  [app/api/properties/route.ts](app/api/properties/route.ts) (lines 5–63) into one
  `filterProperties(sp)`, then add the radius branch once. **⚠ The two copies are NOT identical**:
  the API's text search also matches `tagline` + `description`; the page's does not. Reconcile the
  canonical search semantics **before** extracting, or search behavior silently regresses.
- New `components/MapView.tsx` (`'use client'`, loaded via `next/dynamic` with `ssr:false` —
  Leaflet needs `window`): OSM tiles, one marker per result, a translucent `Circle` for the radius,
  draggable center pin.
- New `components/RadiusControl.tsx`: "Use my location" (`navigator.geolocation`), a Nominatim
  search box, a radius slider (3–10 km, step 1, **default 5**).
- [components/Filters.tsx](components/Filters.tsx): add a "Near me" section; **make
  `apply()`/`reset()` preserve/clear `lat/lng/radius`** (today it rebuilds the query from scratch
  and would silently drop them). Add a "Within N km" chip + a "Nearest" sort.
- Also update [app/api/locations/route.ts](app/api/locations/route.ts) when the repository swaps to
  DB, or it diverges from the listing source.
- **Libraries:** **`leaflet` + `react-leaflet` (v5, React 19 compatible) + `@types/leaflet`**, with
  free **OpenStreetMap** tiles + free **Nominatim** geocoding — **zero API key, zero cost**.
  (Mapbox/Google rejected: both need a billing-enabled key.) Respect Nominatim policy (identifying
  User-Agent + debounce).

---

## 4. Phased roadmap

Ordered so each phase is independently shippable and de-risks the next.

| Phase | Ships | Depends on | Effort |
|---|---|---|---|
| **Phase 0 — Geo-radius (static)** | `lib/geo.ts`, `lib/filter.ts` (dedupe filter logic — reconcile search semantics first), `MapView`, `RadiusControl`, "Near me" + radius slider, "Within N km" chip + "Nearest" sort. Runs entirely against `lib/data.ts`. | Nothing | **M** |
| **Phase 1 — Foundation (auth + DB)** | Auth.js v5, `middleware.ts`, working `/login` + `/signup` **with a NEW Owner/Tenant role selector** (does not exist today), `<SessionProvider>`, real Header/profile. Supabase Postgres + `lib/repository.ts` seam; seed the 32 listings; convert `host → ownerId` **together with `OwnerCard`** (see ⚠ below); move 4 routes to ISR. | Phase 0 (shares `lib/geo.ts`) + Decisions #5, #6 | **L** |
| **Phase 2 — Broker removal** | Owner-bound listings, `createListing` + duplicate detection, enquiry/message tables + actions, `OwnerCard`/`ContactOwnerPanel`, `/messages` inbox + thread, `host/dashboard`. Delete BOTH `+91…` phone blocks. Add PostGIS `ST_DWithin` (dual path with client geo). | Phase 1 | **L** |
| **Phase 3 — Verification** | `Verification` model, `/verify/owner` + `/verify/tenant`, KYC provider + private storage + signed-URL webhook, `VerifiedBadge` everywhere, admin review queue, server-side gates. | Phase 1 + 2 | **L** |

> **⚠ Critical correction from review:** the `host → ownerId` type change **compile-breaks**
> [app/stays/[id]/page.tsx](app/stays/[id]/page.tsx) (it reads `property.host.name` / `.since` and
> passes them to `Avatar`). So the type flip and the new `OwnerCard` that consumes `ownerId`
> **must ship in ONE atomic change (one PR, ideally behind a feature flag)** — not phase-by-phase —
> or `master` is left non-compiling. This is the single biggest risk in the foundation.

Phase 2 and Phase 3 can overlap once Phase 1 is stable — **but** stub the shared
`requireVerifiedOwner()/requireVerifiedTenant()` gate first (it lives in `lib/verification.ts`)
so Phase 2's flows call a real gate, not a no-op.

---

## 5. New dependencies & services (rough India-MVP cost)

**npm packages (all free / MIT):** `next-auth@beta` (+ `@auth/prisma-adapter` *or* `@supabase/ssr`),
DB client (`@supabase/supabase-js` + `@supabase/ssr`, *or* `prisma` + `@prisma/client`), `bcryptjs`
(+ types) for password hashing, `leaflet` + `react-leaflet` + `@types/leaflet`, `zod`, `nanoid`,
`tsx` (dev, seed script), KYC provider SDK (+ `@aws-sdk/client-s3` + presigner only if using S3).

**External services:**
- **Postgres + PostGIS + Storage + Auth** — Supabase free tier covers an MVP (Pro ~US$25/mo as it grows).
- **Map + geocoding** — OpenStreetMap + Nominatim: **free, no key**.
- **KYC / e-KYC** — Digio / Hyperverge / Signzy: business onboarding + API keys, **per-verification
  cost** (a few ₹ to low tens of ₹ per check; the only recurring per-use cost — **start procurement now**, it has lead time).
- **OAuth** — Google client ID/secret: free. **Hosting** — Vercel (free/hobby; ISR + serverless out of the box).

Secrets (`AUTH_SECRET`, `DATABASE_URL`/`SUPABASE_*`, Google + KYC keys) live in `.env.local` + host
env, documented in a committed `.env.example`. The Supabase **service-role key must stay
server-only** (never `NEXT_PUBLIC_`) or RLS is bypassed.

---

## 6. Decisions the client must make

**Prerequisites to Phase 1 (must be answered before foundation work):**
1. **Role assignment (#5):** self-selected Owner/Tenant at signup, or "owner" unlocked only after KYC + ownership proof?
2. **Seed listings (#6):** auto-mark the existing 32 as **verified** (so the site has day-one inventory), or show them "pending" and hide contact until claimed?

**Other decisions:**
3. **Backend stack:** Supabase (recommended) vs. Prisma + Postgres + separate S3 vs. another? Any **India data-residency** constraint?
4. **Auth provider:** Auth.js v5 (recommended, no per-user fee) vs. hosted Clerk (faster, per-MAU pricing)?
5. **KYC provider:** Digio / Hyperverge / Signzy — driven by DigiLocker/Aadhaar coverage, price, onboarding time.
6. **Ownership proof at launch?** Require property docs day one (stronger anti-broker) or add later?
7. **Tenant verification timing:** verify before contacting any owner, or only before the first enquiry / before booking?
8. **Phone numbers, ever?** In-app messaging only, or reveal a number after a confirmed booking?
9. **Duplicate-listing strictness:** hard-block on coordinate proximity + same type, or flag for admin review? What radius?
10. **Geo-filter UX:** confirm slider 3–10 km / default 5; auto-request geolocation on load or wait for a click? Does a radius search AND with a city text search or replace it?
11. **DPDP retention:** keep raw ID documents at all (encrypted, short retention) or rely solely on the provider's token + masked metadata?
12. **Admin/moderation:** seed/CLI admins only, or an admin UI in scope now? Who staffs the queue, at what SLA?
13. **Chat realtime?** Supabase Realtime/websockets vs. simple request-response page reloads for v1.
14. **localStorage migration:** existing guest bookings/favorites have **no `userId`** — migrate them to the new signed-in identity, or drop guest data on first sign-in (documented)?

---

## 7. Known gotchas surfaced by the adversarial review

- **Two** hardcoded broker phone numbers, not one — [app/host/page.tsx](app/host/page.tsx) **and**
  [app/stays/[id]/page.tsx](app/stays/[id]/page.tsx) ~line 251. Both must go.
- `/signup` has **no role field** today (and splits email/phone, no password-confirm) — adding the
  role selector + password onboarding is real work, not "wiring".
- The two `filterAndSort` copies are **not identical** (API searches tagline+description too) —
  reconcile before extracting to `lib/filter.ts`.
- `host → ownerId` must land **atomically with `OwnerCard`** or the detail page won't compile.
- No tests/CI exist (`package.json` has only dev/build/start/lint) — "non-breaking" is currently
  **asserted, not enforced**; add at least a typecheck/build gate in CI before the migration.
- localStorage bookings have **no `userId`** — define their fate before Phase 1 auth ships.
