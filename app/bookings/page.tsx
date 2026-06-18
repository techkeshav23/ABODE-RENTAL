"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { VisitRequest } from "@/lib/storage";
import {
  cancelRequest,
  formatINR,
  getRequests,
  onRequestsChange,
} from "@/lib/storage";

type Tab = "requested" | "confirmed" | "cancelled";

const TABS: Tab[] = ["requested", "confirmed", "cancelled"];

export default function VisitRequestsPage() {
  const [requests, setRequests] = useState<VisitRequest[] | null>(null);
  const [tab, setTab] = useState<Tab>("requested");

  useEffect(() => {
    const refresh = () => setRequests(getRequests());
    refresh();
    return onRequestsChange(refresh);
  }, []);

  const filtered = (requests ?? []).filter((r) => r.status === tab);

  return (
    <div className="bg-paper">
      <section className="bg-cream">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-5 lg:px-10 py-7 sm:py-10 md:py-14">
          <div className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] text-clay mb-2">
            Your enquiries
          </div>
          <h1 className="font-display text-[1.7rem] sm:text-[2.2rem] md:text-[2.8rem] leading-tight tracking-tight">
            My visit requests
          </h1>
          <p className="mt-2 text-[0.92rem] sm:text-[0.98rem] text-ink-soft max-w-md">
            Visits you&apos;ve requested with verified owners. No broker, no
            phone numbers — just a direct enquiry.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-5 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const count = (requests ?? []).filter(
                (r) => r.status === t
              ).length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 sm:px-5 py-3.5 sm:py-4 text-[0.88rem] sm:text-[0.92rem] capitalize whitespace-nowrap ${
                    tab === t ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {t}{" "}
                  <span
                    className={`ml-1 text-[0.78rem] ${
                      tab === t ? "text-clay" : "text-ink-faint"
                    }`}
                  >
                    {count}
                  </span>
                  {tab === t && (
                    <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-clay" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-5 lg:px-10">
          {requests === null ? (
            <div className="text-ink-soft">Loading…</div>
          ) : filtered.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-5">
              {filtered.map((r) => (
                <RequestRow key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function RequestRow({ request }: { request: VisitRequest }) {
  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[240px_1fr] hover:shadow-lg transition-shadow">
      <Link
        href={`/stays/${request.propertySlug}`}
        className="relative aspect-[16/10] md:aspect-auto md:h-full bg-cream-deep group"
      >
        <Image
          src={request.propertyImage}
          alt={request.propertyName}
          fill
          sizes="(max-width:768px) 100vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-2.5 right-2.5 md:hidden">
          <StatusPill status={request.status} compact />
        </div>
      </Link>
      <div className="p-4 sm:p-5 md:p-6 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint mb-0.5">
              {request.id}
            </div>
            <Link
              href={`/stays/${request.propertySlug}`}
              className="font-display text-[1.15rem] sm:text-[1.3rem] md:text-[1.5rem] leading-tight hover:text-clay transition-colors line-clamp-2 block"
            >
              {request.propertyName}
            </Link>
            <div className="text-[0.82rem] sm:text-[0.88rem] text-ink-soft mt-0.5 line-clamp-1">
              {request.neighborhood} · {request.city}
            </div>
            <div className="text-[0.78rem] sm:text-[0.82rem] text-ink-faint mt-0.5">
              to {request.ownerName}
            </div>
          </div>
          <div className="hidden md:block shrink-0">
            <StatusPill status={request.status} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 text-[0.82rem] sm:text-[0.85rem]">
          <KV label="Rent / mo" value={formatINR(request.rent)} />
          <KV label="Visit date" value={fmtDate(request.visitDate)} />
        </div>

        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-line-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-[0.78rem] sm:text-[0.82rem] text-ink-soft">
            Requested {fmtDate(request.createdAt.slice(0, 10))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/stays/${request.propertySlug}`}
              className="flex-1 sm:flex-initial text-center px-4 py-2 text-[0.82rem] sm:text-[0.85rem] border border-line rounded-full hover:border-ink transition"
            >
              View home
            </Link>
            {request.status !== "cancelled" && (
              <button
                onClick={() => {
                  if (confirm("Cancel this visit request?")) {
                    cancelRequest(request.id);
                  }
                }}
                className="flex-1 sm:flex-initial px-4 py-2 text-[0.82rem] sm:text-[0.85rem] text-clay hover:bg-clay/10 rounded-full transition"
              >
                Cancel request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  compact,
}: {
  status: VisitRequest["status"];
  compact?: boolean;
}) {
  const cls = compact
    ? "px-2 py-0.5 text-[0.62rem] tracking-[0.16em]"
    : "px-3 py-1 text-[0.72rem] tracking-[0.18em]";
  if (status === "cancelled") {
    return (
      <span
        className={`${cls} bg-ink/5 text-ink-faint rounded-full uppercase backdrop-blur`}
      >
        Cancelled
      </span>
    );
  }
  if (status === "confirmed") {
    return (
      <span
        className={`${cls} bg-forest/10 text-forest rounded-full uppercase backdrop-blur`}
      >
        ✓ Confirmed
      </span>
    );
  }
  return (
    <span
      className={`${cls} bg-saffron/15 text-saffron rounded-full uppercase backdrop-blur`}
    >
      Requested
    </span>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint mb-0.5">
        {label}
      </div>
      <div className="text-ink font-medium">{value}</div>
    </div>
  );
}

function Empty() {
  return (
    <div className="text-center py-10 sm:py-16 px-4">
      <div className="font-display text-[1.4rem] sm:text-[1.8rem] mb-2">
        No visit requests yet
      </div>
      <p className="text-ink-soft mb-6 sm:mb-7 max-w-sm mx-auto text-[0.92rem] sm:text-[1rem]">
        Find a home you like and request a visit. Requests go directly to the
        verified owner — no broker in between.
      </p>
      <Link
        href="/stays"
        className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-ink text-paper rounded-full hover:bg-clay-deep transition text-[0.9rem] sm:text-[0.95rem]"
      >
        Browse homes →
      </Link>
    </div>
  );
}

function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}
