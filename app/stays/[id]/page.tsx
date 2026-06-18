import Link from "next/link";
import { notFound } from "next/navigation";
import { PROPERTIES, getOwner, getTier } from "@/lib/data";
import { isPremium } from "@/lib/tiers";
import { Gallery } from "@/components/Gallery";
import { ContactOwner } from "@/components/ContactOwner";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertyCard } from "@/components/PropertyCard";
import { SaveButton } from "@/components/SaveButton";
import { Avatar } from "@/components/Avatar";

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.slug }));
}

const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = PROPERTIES.find((p) => p.slug === id || p.id === id);
  if (!property) notFound();

  const owner = getOwner(property.ownerId);
  const verifiedOwner = owner?.verified === "verified";
  const tier = getTier(property);

  const sameCity = PROPERTIES.filter(
    (p) => p.id !== property.id && p.city === property.city
  );
  const related = (sameCity.length
    ? sameCity
    : PROPERTIES.filter((p) => p.id !== property.id)
  ).slice(0, 4);

  const facts = [
    { k: "Monthly rent", v: `${formatINR(property.rent)}` },
    { k: "Deposit", v: `${formatINR(property.deposit)}` },
    { k: "Configuration", v: `${property.bedrooms} BHK · ${property.bathrooms} bath` },
    { k: "Carpet area", v: `${property.area} sq ft` },
    { k: "Furnishing", v: property.furnishing },
    { k: "Preferred tenants", v: property.preferredTenants },
    { k: "Available from", v: property.availableFrom },
  ];

  return (
    <div className="pb-[76px] lg:pb-0">
      <section className="pt-6 pb-5">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <nav className="text-[0.82rem] text-ink-soft mb-3 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span className="text-ink-faint">/</span>
            <Link href="/stays" className="hover:text-ink">
              Rental homes
            </Link>
            <span className="text-ink-faint">/</span>
            <span className="text-ink">{property.city}</span>
          </nav>

          <div className="flex items-end justify-between gap-4 sm:gap-6 flex-wrap">
            <div className="max-w-3xl min-w-0">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className="text-[0.7rem] uppercase tracking-[0.24em] text-clay">
                  {property.bedrooms} BHK rental home
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[0.66rem] uppercase tracking-[0.14em] font-medium ${
                    isPremium(tier)
                      ? "bg-saffron text-ink"
                      : "bg-cream text-ink-soft border border-line"
                  }`}
                >
                  {isPremium(tier) ? `★ ${tier}` : tier}
                </span>
              </div>
              <h1 className="font-display text-[1.6rem] sm:text-[1.9rem] md:text-[2.6rem] leading-tight tracking-tight">
                {property.name}
              </h1>
              <p className="text-[0.98rem] text-ink-soft mt-2">{property.tagline}</p>
              <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-1 text-[0.9rem] text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <span className="text-clay">★</span>
                  <span className="text-ink font-medium">
                    {property.rating.toFixed(1)}
                  </span>
                  <span>({property.reviews} reviews)</span>
                </span>
                <span className="text-ink-faint">·</span>
                <span>
                  {property.neighborhood}, {property.city}, {property.state}
                </span>
                <span className="text-ink-faint">·</span>
                <span>
                  {property.bedrooms} BHK · {property.bathrooms} bath · {property.area} sq ft
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <SaveButton slug={property.slug} variant="detail" />
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-line rounded-full text-[0.85rem] hover:border-ink">
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <Gallery images={property.images} alt={property.name} />
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7">
              {/* Owner — direct, verified, no broker */}
              <div className="flex items-center justify-between gap-3 pb-6 border-b border-line">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={owner?.name ?? "Owner"} size={56} />
                  <div className="min-w-0">
                    <h2 className="font-display text-[1.25rem] sm:text-[1.4rem] leading-tight">
                      Listed directly by {owner?.name}
                    </h2>
                    <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[0.85rem]">
                      {verifiedOwner ? (
                        <span className="inline-flex items-center gap-1 text-forest">
                          <VerifiedIcon /> Verified owner
                        </span>
                      ) : (
                        <span className="text-saffron">Verification in progress</span>
                      )}
                      <span className="text-ink-faint">·</span>
                      <span className="text-ink-soft">Owner since {owner?.since}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick facts */}
              <div className="py-7 border-b border-line">
                <h2 className="font-display text-[1.4rem] mb-4">Home details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facts.map((f) => (
                    <div key={f.k} className="px-3 py-2.5 bg-cream/40 border border-line-soft rounded-lg">
                      <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
                        {f.k}
                      </div>
                      <div className="text-[0.95rem] text-ink mt-0.5">{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-7 border-b border-line">
                <h2 className="font-display text-[1.4rem] mb-4">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-[0.95rem]">
                      <CheckIcon />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-7 border-b border-line">
                <h2 className="font-display text-[1.4rem] mb-3">About this home</h2>
                <p className="text-[0.98rem] leading-relaxed text-ink whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div className="py-7 border-b border-line">
                <h2 className="font-display text-[1.4rem] mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 px-3 py-2.5 bg-cream/40 border border-line-soft rounded-lg">
                      <CheckIcon />
                      <span className="text-[0.9rem]">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-7 border-b border-line">
                <h2 className="font-display text-[1.4rem] mb-3">House rules</h2>
                <ul className="space-y-2 text-[0.95rem]">
                  {property.rules.map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <span className="text-ink-faint mt-1">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-7">
                <h2 className="font-display text-[1.4rem] mb-3">Location</h2>
                <div className="relative h-[240px] sm:h-[320px] rounded-2xl overflow-hidden border border-line">
                  <PropertyMap
                    name={property.name}
                    neighborhood={property.neighborhood}
                    rent={property.rent}
                    coordinates={property.coordinates}
                  />
                </div>
                <p className="mt-2 text-[0.8rem] text-ink-faint">
                  Approximate location. The exact address is shared by the owner once
                  your visit is confirmed.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-[72px]">
                <ContactOwner property={property} />

                <div className="mt-5 p-4 bg-cream/40 border border-line rounded-xl text-[0.88rem] text-ink-soft">
                  <div className="font-medium text-ink mb-1 inline-flex items-center gap-1.5">
                    <VerifiedIcon /> Why there's no phone number here
                  </div>
                  Abode keeps the conversation in-app so no broker can sit between you
                  and the owner. Send a visit request and {owner?.name?.split(" ")[0]} replies directly.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-12 bg-cream/40 border-y border-line">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint mb-2">
                Reviews
              </div>
              <h2 className="font-display text-[1.5rem] md:text-[2rem] leading-tight">
                <span className="text-clay">★ {property.rating.toFixed(1)}</span> ·{" "}
                {property.reviews} reviews
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_REVIEWS.slice(0, 3).map((r, i) => (
              <div key={i} className="p-5 bg-paper border border-line rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={r.name} size={40} />
                  <div>
                    <div className="font-medium text-[0.92rem]">{r.name}</div>
                    <div className="text-[0.78rem] text-ink-faint">{r.when}</div>
                  </div>
                </div>
                <p className="text-[0.92rem] leading-relaxed text-ink">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
            <h2 className="font-display text-[1.6rem] md:text-[2rem] leading-tight mb-7">
              More homes in {property.city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky action bar — sits above the 68px BottomNav, hidden on desktop */}
      <div className="lg:hidden fixed inset-x-0 bottom-[68px] bg-paper border-t border-line px-4 py-3 z-30">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-[1.2rem] truncate">
              {formatINR(property.rent)}
              <span className="text-[0.78rem] text-ink-soft ml-1">/mo</span>
            </div>
            <div className="text-[0.78rem] text-ink-soft truncate">
              ★ {property.rating.toFixed(1)} · {property.reviews} reviews
            </div>
          </div>
          <a href="#contact" className="shrink-0 px-5 sm:px-6 py-3 bg-clay text-paper rounded-full text-[0.9rem] whitespace-nowrap">
            Request a visit
          </a>
        </div>
      </div>
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    name: "Anjali",
    when: "Mar 2026",
    body: "Owner showed the flat herself, answered every question on the app, and the place was exactly like the photos. No broker, no nonsense.",
  },
  {
    name: "Rohan",
    when: "Feb 2026",
    body: "Loved that I could message the owner directly and fix a visit slot. Paperwork was clean and the deposit terms were upfront.",
  },
  {
    name: "Priya",
    when: "Jan 2026",
    body: "Found this within 4 km of my office using the map search. Moved in two weeks later. Owner was verified and very responsive.",
  },
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-clay shrink-0 mt-0.5" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M4.5 8.2l2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#264d3d" aria-hidden>
      <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.5l1-3-1-3 2.6-1.9 1-3 3.2.2z" />
      <path d="M8.5 12l2.3 2.3 4.2-4.6" stroke="#fbf8f3" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
