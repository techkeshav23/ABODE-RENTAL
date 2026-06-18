"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import {
  getFavorites,
  getRequests,
  onFavoritesChange,
  onRequestsChange,
} from "@/lib/storage";

// Demo signed-in tenant (broker-free model: verified tenants contact owners directly).
const TENANT_NAME = "Aarav Sharma";

export default function ProfilePage() {
  const [stats, setStats] = useState({
    requests: 0,
    saved: 0,
    confirmed: 0,
    cities: 0,
  });

  useEffect(() => {
    const refresh = () => {
      const reqs = getRequests().filter((r) => r.status !== "cancelled");
      const confirmed = reqs.filter((r) => r.status === "confirmed");
      setStats({
        requests: reqs.length,
        saved: getFavorites().length,
        confirmed: confirmed.length,
        cities: new Set(reqs.map((r) => r.city)).size,
      });
    };
    refresh();
    const off1 = onRequestsChange(refresh);
    const off2 = onFavoritesChange(refresh);
    return () => {
      off1();
      off2();
    };
  }, []);

  return (
    <div className="bg-paper">
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-10 py-10 md:py-14">
          <div className="flex items-center gap-4">
            <Avatar name={TENANT_NAME} size={64} />
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/20 border border-forest-soft/40 text-forest-soft px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] mb-2">
                <TickIcon />
                Verified tenant
              </div>
              <h1 className="font-display text-[1.9rem] md:text-[2.4rem] leading-tight tracking-tight">
                {TENANT_NAME}
              </h1>
              <p className="text-[0.9rem] opacity-80 mt-1">
                Your identity is verified — you can contact owners and request
                visits directly. No brokers, no fees.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="My requests" value={String(stats.requests)} />
            <Stat label="Confirmed visits" value={String(stats.confirmed)} />
            <Stat label="Saved homes" value={String(stats.saved)} />
            <Stat label="Cities" value={String(stats.cities)} />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
          <div className="bg-forest-soft/10 border border-forest-soft/30 rounded-2xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-forest text-paper">
                    <TickIcon />
                  </span>
                  <h2 className="font-display text-[1.4rem]">Verification</h2>
                </div>
                <p className="text-[0.85rem] text-ink-soft mt-1.5 max-w-md">
                  Verification is what unlocks contacting owners directly. Both
                  your identity and phone are confirmed.
                </p>
              </div>
              <Link
                href="/verify"
                className="rounded-full border border-forest text-forest hover:bg-forest hover:text-paper transition-colors px-4 py-2 text-[0.85rem] font-medium"
              >
                Manage verification
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <VerifyRow label="Identity verified" />
              <VerifyRow label="Phone verified" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-4">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
          <h2 className="font-display text-[1.4rem] mb-5">Quick actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ActionCard
              href="/bookings"
              label="My requests"
              hint="Visit requests"
              icon="trips"
            />
            <ActionCard
              href="/saved"
              label="Saved homes"
              hint="Your shortlist"
              icon="heart"
            />
            <ActionCard
              href="/host"
              label="List your home"
              hint="Become an owner"
              icon="key"
            />
            <ActionCard
              href="/stays"
              label="Find homes"
              hint="Browse all rentals"
              icon="search"
            />
          </div>
        </div>
      </section>

      <section className="pb-12 pt-8">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Group title="Account">
            <Item label="Personal information" hint="Name, email, phone" />
            <Item label="Login and security" hint="Password, 2FA" />
            <ItemLink
              href="/verify"
              label="Identity verification"
              hint="Unlocks contacting owners"
            />
            <Item label="Communication" hint="How owners reach you" />
          </Group>
          <Group title="Preferences">
            <Item label="Notifications" hint="Email, SMS, push" />
            <Item label="Language" hint="English" right="EN" />
            <Item label="Currency" hint="Indian Rupee" right="INR" />
            <Item label="Home preferences" hint="Budget, furnishing, beds" />
          </Group>
          <Group title="Support">
            <Item label="Help centre" hint="FAQs and articles" />
            <ItemLink
              href="/bookings"
              label="My visit requests"
              hint="Track and manage"
            />
            <Item label="Report a concern" hint="Safety or fraud" />
            <Item label="How verification works" hint="Trust and safety" />
          </Group>
          <Group title="Legal">
            <Item label="Privacy policy" />
            <Item label="Terms of service" />
            <Item label="Community guidelines" />
            <Item label="Sign out" tone="clay" />
          </Group>
        </div>
        <div className="text-center text-[0.78rem] text-ink-faint mt-8 px-5">
          Abode v1.0.0
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper/10 border border-paper/15 rounded-xl px-4 py-3.5">
      <div className="font-display text-[1.5rem] leading-none">{value}</div>
      <div className="mt-1.5 text-[0.78rem] text-paper/70">{label}</div>
    </div>
  );
}

function VerifyRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-paper border border-line rounded-xl px-4 py-3">
      <span className="grid place-items-center w-6 h-6 rounded-full bg-forest text-paper shrink-0">
        <TickIcon />
      </span>
      <span className="text-[0.92rem] font-medium">{label}</span>
    </div>
  );
}

function TickIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ActionCard({
  href,
  label,
  hint,
  icon,
}: {
  href: string;
  label: string;
  hint: string;
  icon: "trips" | "heart" | "key" | "search";
}) {
  return (
    <Link
      href={href}
      className="group bg-paper border border-line rounded-2xl p-5 hover:border-ink hover:-translate-y-0.5 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-cream grid place-items-center mb-3 text-clay group-hover:bg-clay group-hover:text-paper transition-colors">
        <ActionIcon name={icon} />
      </div>
      <div className="font-medium text-[1rem] leading-tight">{label}</div>
      <div className="text-[0.82rem] text-ink-soft mt-0.5">{hint}</div>
    </Link>
  );
}

function ActionIcon({ name }: { name: string }) {
  const c = "currentColor";
  if (name === "trips")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" />
      </svg>
    );
  if (name === "heart")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7.5-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2 4.5-9.5 9-9.5 9z" />
      </svg>
    );
  if (name === "key")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="14.5" r="3.5" />
        <path d="M11 14l9-9m-3 0h3v3" />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft">
        <div className="text-[0.7rem] uppercase tracking-[0.18em] text-clay">
          {title}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Item({
  label,
  hint,
  right,
  tone,
}: {
  label: string;
  hint?: string;
  right?: string;
  tone?: "clay";
}) {
  return (
    <button
      className={`w-full flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-cream/50 border-b border-line-soft last:border-b-0 text-left ${
        tone === "clay" ? "text-clay" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="text-[0.95rem]">{label}</div>
        {hint && <div className="text-[0.78rem] text-ink-faint">{hint}</div>}
      </div>
      <div className="flex items-center gap-2 text-ink-faint shrink-0">
        {right && <span className="text-[0.85rem]">{right}</span>}
        <span>›</span>
      </div>
    </button>
  );
}

function ItemLink({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="w-full flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-cream/50 border-b border-line-soft last:border-b-0 text-left"
    >
      <div className="min-w-0">
        <div className="text-[0.95rem]">{label}</div>
        {hint && <div className="text-[0.78rem] text-ink-faint">{hint}</div>}
      </div>
      <div className="flex items-center gap-2 text-ink-faint shrink-0">
        <span>›</span>
      </div>
    </Link>
  );
}
