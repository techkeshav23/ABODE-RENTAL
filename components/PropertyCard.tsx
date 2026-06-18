import Link from "next/link";
import type { Property } from "@/lib/types";
import { getOwner } from "@/lib/data";
import { SaveButton } from "./SaveButton";
import { CardGallery } from "./CardGallery";

const formatRent = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function PropertyCard({
  property,
  size = "md",
}: {
  property: Property;
  size?: "sm" | "md" | "lg";
}) {
  const aspect = size === "sm" ? "aspect-[4/3]" : "aspect-[5/4]";
  const owner = getOwner(property.ownerId);
  const verified = owner?.verified === "verified";

  return (
    <Link href={`/stays/${property.slug}`} className="group block">
      <div className={`relative ${aspect} rounded-2xl overflow-hidden bg-cream-deep`}>
        <CardGallery images={property.images} alt={property.name} />
        <SaveButton slug={property.slug} />
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between pointer-events-none">
          <div className="px-2.5 py-1 bg-paper/95 backdrop-blur rounded-full text-[0.68rem] uppercase tracking-[0.16em] text-ink">
            {property.bedrooms} BHK
          </div>
          <div className="stamp inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.78rem] mr-10 md:mr-12 shrink-0">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="shrink-0">
              <path d="M6 0l1.7 4.1L12 4.6l-3.2 2.9L9.7 12 6 9.6 2.3 12l1-4.5L0 4.6l4.3-.5z" />
            </svg>
            <span className="font-medium tabular-nums">{property.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 pb-2">
        <h3 className="font-display text-[1.05rem] md:text-[1.15rem] leading-snug text-ink line-clamp-1 group-hover:text-clay transition-colors">
          {property.name}
        </h3>
        <div className="text-[0.82rem] md:text-[0.85rem] text-ink-soft mt-1 line-clamp-1">
          {property.neighborhood}
          <span className="text-ink-faint mx-1.5">·</span>
          {property.city}
        </div>

        {/* Direct-from-owner trust line — no broker */}
        <div className="mt-1.5 inline-flex items-center gap-1 text-[0.74rem]">
          {verified ? (
            <>
              <VerifiedIcon />
              <span className="text-ink-soft">
                {owner?.name} ·{" "}
                <span className="text-forest font-medium">Verified owner</span>
              </span>
            </>
          ) : (
            <span className="text-ink-faint">
              {owner?.name} · Verification pending
            </span>
          )}
        </div>

        <div className="text-[0.78rem] text-ink-faint mt-1 line-clamp-1">
          {property.furnishing} · {property.area} sq ft
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="font-display text-[1.1rem] md:text-[1.15rem] text-ink">
            {formatRent(property.rent)}
          </span>
          <span className="text-[0.78rem] text-ink-faint">/mo</span>
          <span className="text-[0.72rem] text-ink-faint w-full md:w-auto md:ml-auto truncate">
            {formatRent(property.deposit)} deposit
          </span>
        </div>
      </div>
    </Link>
  );
}

function VerifiedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#264d3d" aria-hidden>
      <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.5l1-3-1-3 2.6-1.9 1-3 3.2.2z" />
      <path d="M8.5 12l2.3 2.3 4.2-4.6" stroke="#fbf8f3" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
