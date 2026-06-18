"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { getOwner } from "@/lib/data";
import {
  formatINR,
  canRequestVisit,
  getActiveRequests,
  onRequestsChange,
  MAX_ACTIVE_VISITS,
  type RequestGate,
} from "@/lib/storage";
import { VisitWizard } from "./VisitWizard";

export function ContactOwner({ property }: { property: Property }) {
  const owner = getOwner(property.ownerId);
  const verifiedOwner = owner?.verified === "verified";

  const [open, setOpen] = useState(false);
  const [gate, setGate] = useState<RequestGate>({ ok: true });
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setGate(canRequestVisit(property.slug));
      setActiveCount(getActiveRequests().length);
    };
    refresh();
    return onRequestsChange(refresh);
  }, [property.slug]);

  return (
    <div
      id="contact"
      className="w-full max-w-full bg-paper border border-line rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_-12px_rgba(26,20,13,0.18)]"
    >
      {/* Rent summary */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-1">
        <div className="min-w-0">
          <span className="font-display text-[1.6rem] sm:text-[1.8rem]">{formatINR(property.rent)}</span>
          <span className="text-[0.92rem] text-ink-soft ml-1">/month</span>
        </div>
        <div className="text-[0.82rem] text-ink-soft inline-flex items-center gap-1 shrink-0">
          <span className="text-clay">★</span>
          {property.rating.toFixed(1)}
          <span className="text-ink-faint">·</span>
          {property.reviews}
        </div>
      </div>
      <div className="text-[0.82rem] text-ink-soft break-words">
        {formatINR(property.deposit)} deposit · {property.furnishing} · Available{" "}
        {property.availableFrom}
      </div>

      {/* Owner block — direct, no broker */}
      <div className="mt-5 pt-5 border-t border-line-soft flex items-center gap-3">
        <div className="w-11 h-11 shrink-0 rounded-full bg-forest/10 text-forest grid place-items-center font-display text-[1.1rem]">
          {(owner?.name ?? "O").charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.92rem] font-medium text-ink truncate">{owner?.name}</div>
          {verifiedOwner ? (
            <div className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.76rem] text-forest">
              <VerifiedIcon /> Verified owner · {owner?.responseTime}
            </div>
          ) : (
            <div className="text-[0.76rem] text-saffron">Verification in progress</div>
          )}
        </div>
      </div>

      {gate.ok ? (
        <div className="mt-5">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-clay hover:bg-clay-deep text-paper rounded-xl py-3.5 text-[0.98rem] font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            Request a visit
            <span aria-hidden>→</span>
          </button>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-[0.76rem] text-ink-faint">
            <ClockIcon />
            {activeCount}/{MAX_ACTIVE_VISITS} open visits · 3-step verified booking
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-saffron/40 bg-saffron-soft/30 p-5">
          <div className="font-medium text-ink mb-1 inline-flex items-center gap-1.5">
            <ClockIcon /> One visit at a time
          </div>
          <p className="text-[0.86rem] text-ink-soft">{gate.reason}</p>
          <Link href="/bookings" className="inline-block mt-3 text-[0.85rem] text-clay underline">
            Manage my visit requests →
          </Link>
        </div>
      )}

      <p className="mt-4 text-[0.78rem] text-ink-faint text-center leading-relaxed">
        Abode connects you <strong className="text-ink-soft">directly with the owner</strong>.
        No broker, no brokerage. Every visit is a real, verified 1:1 slot — easy for a genuine
        renter, impossible for a broker juggling dozens of homes.
      </p>

      {open && <VisitWizard property={property} onClose={() => setOpen(false)} />}
    </div>
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

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
