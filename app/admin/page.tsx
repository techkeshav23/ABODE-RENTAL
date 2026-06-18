"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Furnishing, Tier, VerificationStatus } from "@/lib/types";
import { TIERS, TIER_CLASSIC, TIER_PREMIUM, TIER_LABEL } from "@/lib/tiers";
import {
  ADMIN_PASSCODE,
  addListing,
  adminLogin,
  adminLogout,
  adminStats,
  getAdminListings,
  getAdminOwners,
  isAdminAuthed,
  onAdminChange,
  removeListing,
  setOwnerVerified,
  updateListing,
  type AdminListing,
  type AdminOwner,
} from "@/lib/adminStore";
import {
  formatINR,
  getRequests,
  onRequestsChange,
  setRequestStatus,
  type VisitRequest,
} from "@/lib/storage";

type Tab = "overview" | "listings" | "owners" | "requests";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "listings", label: "Listings" },
  { id: "owners", label: "Owners" },
  { id: "requests", label: "Requests" },
];

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  // data, refreshed live
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [owners, setOwners] = useState<AdminOwner[]>([]);
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setReady(true);
    setAuthed(isAdminAuthed());
    const refresh = () => {
      setAuthed(isAdminAuthed());
      setListings(getAdminListings());
      setOwners(getAdminOwners());
      setRequests(getRequests());
      setTick((t) => t + 1);
    };
    refresh();
    const off1 = onAdminChange(refresh);
    const off2 = onRequestsChange(refresh);
    return () => {
      off1();
      off2();
    };
  }, []);

  const stats = useMemo(() => (ready && authed ? adminStats() : null), [ready, authed, tick]);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-ink-faint">Loading…</div>;
  }

  if (!authed) return <Login onDone={() => setAuthed(isAdminAuthed())} />;

  return (
    <div className="min-h-screen bg-cream/30">
      {/* Top bar */}
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 grid place-items-center rounded-lg bg-clay font-display">A</span>
            <div className="leading-tight">
              <div className="font-display text-[1.05rem]">Abode Admin</div>
              <div className="text-[0.66rem] text-paper/60">Live demo console</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[0.82rem] text-paper/70 hover:text-paper px-3 py-1.5">
              View site ↗
            </Link>
            <button
              onClick={adminLogout}
              className="text-[0.82rem] bg-paper/10 hover:bg-paper/20 rounded-full px-3 py-1.5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-paper border-b border-line sticky top-0 z-10">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-3 text-[0.88rem] border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-clay text-ink font-medium"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
              {t.id === "requests" && requests.length > 0 && (
                <span className="ml-1.5 text-[0.7rem] bg-clay text-paper rounded-full px-1.5 py-0.5">
                  {requests.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1300px] px-4 sm:px-6 py-6">
        {tab === "overview" && stats && <Overview stats={stats} />}
        {tab === "listings" && <Listings listings={listings} />}
        {tab === "owners" && <Owners owners={owners} />}
        {tab === "requests" && <Requests requests={requests} />}
      </main>
    </div>
  );
}

/* ─── login ─── */
function Login({ onDone }: { onDone: () => void }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center bg-cream/40 px-4">
      <div className="w-full max-w-sm bg-paper border border-line rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 grid place-items-center rounded-lg bg-clay text-paper font-display">A</span>
          <div>
            <div className="font-display text-[1.2rem] leading-tight">Abode Admin</div>
            <div className="text-[0.78rem] text-ink-soft">Restricted console</div>
          </div>
        </div>
        <label className="block text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
          Passcode
        </label>
        <input
          type="password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (adminLogin(pass)) onDone();
              else setErr(true);
            }
          }}
          placeholder="••••••"
          className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink"
        />
        {err && <p className="text-[0.8rem] text-clay mt-1.5">Wrong passcode.</p>}
        <button
          onClick={() => (adminLogin(pass) ? onDone() : setErr(true))}
          className="w-full mt-4 bg-ink text-paper rounded-xl py-3 text-[0.92rem] hover:bg-clay-deep transition-colors"
        >
          Enter dashboard
        </button>
        <p className="mt-3 text-center text-[0.74rem] text-ink-faint">
          Demo passcode: <span className="font-mono text-ink-soft">{ADMIN_PASSCODE}</span>
        </p>
      </div>
    </div>
  );
}

/* ─── overview ─── */
function Overview({ stats }: { stats: ReturnType<typeof adminStats> }) {
  const cards = [
    { k: "Live listings", v: stats.totalListings, sub: `${stats.premium} ${TIER_PREMIUM} · ${stats.classic} ${TIER_CLASSIC}` },
    { k: TIER_PREMIUM, v: stats.premium, sub: "tagged homes" },
    { k: "Owners", v: stats.owners, sub: `${stats.verifiedOwners} verified` },
    { k: "Visit requests", v: stats.requests, sub: `${stats.openRequests} open` },
  ];
  return (
    <div>
      <h2 className="font-display text-[1.5rem] mb-4">Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.k} className="bg-paper border border-line rounded-2xl p-5">
            <div className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint">{c.k}</div>
            <div className="font-display text-[2rem] leading-none mt-2">{c.v}</div>
            <div className="text-[0.78rem] text-ink-soft mt-1">{c.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-[0.82rem] text-ink-faint mt-5">
        Live demo: visit requests created on the site appear here instantly. Listing &amp; owner
        edits persist on this device. Multi-user real-time sync ships with the database phase.
      </p>
    </div>
  );
}

/* ─── listings ─── */
function Listings({ listings }: { listings: AdminListing[] }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-display text-[1.5rem]">Listings ({listings.length})</h2>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="bg-clay hover:bg-clay-deep text-paper rounded-full px-4 py-2 text-[0.85rem]"
        >
          {showAdd ? "Close" : "+ Add listing"}
        </button>
      </div>

      {showAdd && <AddForm onAdded={() => setShowAdd(false)} />}

      <div className="space-y-2.5">
        {listings.map((l) => (
          <ListingRow key={l.id} l={l} />
        ))}
      </div>
    </div>
  );
}

function ListingRow({ l }: { l: AdminListing }) {
  return (
    <div
      className={`bg-paper border rounded-xl p-3 flex items-center gap-3 flex-wrap ${
        l.hidden ? "border-line opacity-55" : "border-line"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={l.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover bg-cream-deep shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-[0.95rem] truncate">
          {l.name}
          {l.isAdded && <span className="ml-2 text-[0.66rem] text-forest">• added</span>}
        </div>
        <div className="text-[0.8rem] text-ink-soft truncate">
          {l.neighborhood}, {l.city} · {formatINR(l.rent)}/mo · {l.bedrooms} BHK
        </div>
      </div>

      <select
        value={l.tierResolved}
        onChange={(e) => updateListing(l.id, { tier: e.target.value })}
        className="text-[0.82rem] border border-line rounded-lg px-2 py-1.5 bg-paper"
      >
        {TIERS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button
        onClick={() => updateListing(l.id, { featured: !l.featured })}
        className={`text-[0.78rem] rounded-full px-3 py-1.5 border ${
          l.featured ? "bg-saffron border-saffron text-ink" : "border-line text-ink-soft"
        }`}
      >
        {l.featured ? "★ Featured" : "Feature"}
      </button>

      <button
        onClick={() => updateListing(l.id, { hidden: !l.hidden })}
        className="text-[0.78rem] rounded-full px-3 py-1.5 border border-line text-ink-soft hover:border-ink"
      >
        {l.hidden ? "Show" : "Hide"}
      </button>

      {l.isAdded && (
        <button
          onClick={() => removeListing(l.id)}
          className="text-[0.78rem] rounded-full px-3 py-1.5 border border-clay/40 text-clay hover:bg-clay/5"
        >
          Delete
        </button>
      )}
    </div>
  );
}

function AddForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [furnishing, setFurnishing] = useState<Furnishing>("Semi-furnished");
  const [tier, setTier] = useState<Tier>(TIER_CLASSIC);

  const ok = name && city && neighborhood && rent;
  const submit = () => {
    if (!ok) return;
    addListing({
      name,
      city,
      neighborhood,
      rent: Number(rent),
      deposit: Number(deposit || Number(rent) * 2),
      bedrooms: Number(bedrooms),
      furnishing,
      tier,
    });
    onAdded();
  };

  return (
    <div className="bg-paper border border-line rounded-xl p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Field label="Home name"><Inp v={name} on={setName} ph="e.g. Indiranagar 2BHK" /></Field>
        <Field label="City"><Inp v={city} on={setCity} ph="Bengaluru" /></Field>
        <Field label="Neighbourhood"><Inp v={neighborhood} on={setNeighborhood} ph="Indiranagar" /></Field>
        <Field label="Monthly rent (₹)"><Inp v={rent} on={setRent} ph="45000" num /></Field>
        <Field label="Deposit (₹)"><Inp v={deposit} on={setDeposit} ph="90000" num /></Field>
        <Field label="Bedrooms">
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inpCls}>
            {["1", "2", "3", "4"].map((b) => <option key={b} value={b}>{b} BHK</option>)}
          </select>
        </Field>
        <Field label="Furnishing">
          <select value={furnishing} onChange={(e) => setFurnishing(e.target.value as Furnishing)} className={inpCls}>
            {["Furnished", "Semi-furnished", "Unfurnished"].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label={TIER_LABEL}>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className={inpCls}>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <button
        onClick={submit}
        disabled={!ok}
        className="mt-3 bg-ink text-paper rounded-xl px-5 py-2.5 text-[0.88rem] disabled:opacity-40"
      >
        Save listing
      </button>
    </div>
  );
}

/* ─── owners ─── */
function Owners({ owners }: { owners: AdminOwner[] }) {
  return (
    <div>
      <h2 className="font-display text-[1.5rem] mb-4">Owners ({owners.length})</h2>
      <div className="space-y-2.5">
        {owners.map((o) => (
          <div key={o.id} className="bg-paper border border-line rounded-xl p-3 flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-full bg-forest/10 text-forest grid place-items-center font-display shrink-0">
              {o.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-[0.95rem] truncate">{o.name}</div>
              <div className="text-[0.8rem] text-ink-soft">
                Since {o.since} · {o.listings} listing{o.listings === 1 ? "" : "s"}
              </div>
            </div>
            <select
              value={o.verified}
              onChange={(e) => setOwnerVerified(o.id, e.target.value as VerificationStatus)}
              className={`text-[0.82rem] border rounded-lg px-2 py-1.5 ${
                o.verified === "verified"
                  ? "border-forest/40 text-forest bg-forest/5"
                  : o.verified === "pending"
                  ? "border-saffron/50 text-ink bg-saffron-soft/30"
                  : "border-line text-ink-soft"
              }`}
            >
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── requests ─── */
function Requests({ requests }: { requests: VisitRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 text-ink-soft">
        <div className="font-display text-[1.3rem] mb-1">No visit requests yet</div>
        <p className="text-[0.9rem]">
          Create one on a{" "}
          <Link href="/stays" className="text-clay underline">listing</Link> — it appears here live.
        </p>
      </div>
    );
  }
  const pill: Record<VisitRequest["status"], string> = {
    requested: "bg-saffron-soft/40 text-ink",
    confirmed: "bg-forest/10 text-forest",
    cancelled: "bg-cream text-ink-faint line-through",
  };
  return (
    <div>
      <h2 className="font-display text-[1.5rem] mb-4">Visit requests ({requests.length})</h2>
      <div className="space-y-2.5">
        {requests.map((r) => (
          <div key={r.id} className="bg-paper border border-line rounded-xl p-3 flex items-center gap-3 flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.propertyImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-cream-deep shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-[0.92rem] truncate">{r.propertyName}</div>
              <div className="text-[0.78rem] text-ink-soft truncate">
                {r.tenantName} → {r.ownerName} · {r.visitDate} {r.visitSlot.split(" · ")[0]}
              </div>
            </div>
            {r.paid && (
              <span className="text-[0.7rem] text-forest border border-forest/30 rounded-full px-2 py-0.5">
                ₹{r.tokenAmount} paid
              </span>
            )}
            <span className={`text-[0.74rem] rounded-full px-2.5 py-1 capitalize ${pill[r.status]}`}>
              {r.status}
            </span>
            {r.status !== "confirmed" && (
              <button
                onClick={() => setRequestStatus(r.id, "confirmed")}
                className="text-[0.76rem] rounded-full px-3 py-1.5 bg-forest text-paper"
              >
                Confirm
              </button>
            )}
            {r.status !== "cancelled" && (
              <button
                onClick={() => setRequestStatus(r.id, "cancelled")}
                className="text-[0.76rem] rounded-full px-3 py-1.5 border border-line text-ink-soft hover:border-clay hover:text-clay"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── shared form bits ─── */
const inpCls =
  "w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.92rem] outline-none focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.66rem] uppercase tracking-[0.18em] text-ink-faint mb-1">{label}</span>
      {children}
    </label>
  );
}
function Inp({ v, on, ph, num }: { v: string; on: (s: string) => void; ph: string; num?: boolean }) {
  return (
    <input
      value={v}
      onChange={(e) => on(num ? e.target.value.replace(/\D/g, "") : e.target.value)}
      placeholder={ph}
      inputMode={num ? "numeric" : "text"}
      className={inpCls}
    />
  );
}
