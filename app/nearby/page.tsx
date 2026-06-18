import type { Metadata } from "next";
import { NearbyExplorer } from "@/components/NearbyExplorer";

export const metadata: Metadata = {
  title: "Search nearby · Abode",
  description: "Find verified stays within your chosen distance — directly from owners, no brokers.",
};

export default function NearbyPage() {
  return (
    <div className="bg-paper min-h-screen">
      <section className="pt-8 pb-5 border-b border-line">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <div className="text-[0.7rem] uppercase tracking-[0.22em] text-clay mb-2">
            Search by map
          </div>
          <h1 className="font-display text-[1.8rem] md:text-[2.4rem] leading-tight tracking-tight">
            Stays near you
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill icon="shield">Direct from owners — no brokers</Pill>
            <Pill icon="check">Verified owners &amp; tenants</Pill>
            <Pill icon="pin">Filter by 1–10 km radius</Pill>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <NearbyExplorer />
        </div>
      </section>
    </div>
  );
}

function Pill({ icon, children }: { icon: "shield" | "check" | "pin"; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-line-soft rounded-full text-[0.82rem] text-ink">
      <span className="text-forest">{ICONS[icon]}</span>
      {children}
    </span>
  );
}

const ICONS = {
  shield: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12l2.3 2.3 4.7-5" />
    </svg>
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};
