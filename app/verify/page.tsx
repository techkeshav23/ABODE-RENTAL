"use client";

import { useState } from "react";
import Link from "next/link";

type VState = "unverified" | "pending" | "verified";

const STATES: VState[] = ["unverified", "pending", "verified"];

const STATE_LABEL: Record<VState, string> = {
  unverified: "Unverified",
  pending: "Pending",
  verified: "Verified",
};

export default function VerifyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10 py-16 md:py-24">
          <div className="text-[0.7rem] uppercase tracking-[0.32em] text-forest mb-5 inline-flex items-center gap-2">
            <TickBadge size={16} />
            Trust on Abode
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <h1 className="lg:col-span-8 font-display text-[2.2rem] md:text-[3.4rem] lg:text-[4.2rem] leading-[0.98] tracking-tight">
              No brokers. Verification is what makes direct trust possible.
            </h1>
            <p className="lg:col-span-4 text-[1rem] leading-relaxed text-ink-soft max-w-md">
              On Abode, owners and tenants reach each other directly, with no
              middleman in between. A simple two-sided check is what keeps that
              honest, so a verified tick means a real person on the other end.
            </p>
          </div>
        </div>
      </section>

      {/* Two-sided verification cards */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            <h2 className="lg:col-span-7 font-display text-[1.8rem] md:text-[2.6rem] leading-tight">
              Two sides, one standard
            </h2>
            <p className="lg:col-span-5 text-[1rem] text-ink-soft leading-relaxed">
              Both owners and tenants verify before they connect. It is quick,
              private, and only happens once. Your documents are never shown to
              the other party, only the green tick is.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VerifyCard
              side="Owners"
              accent="clay"
              intro="List directly and earn tenant trust from day one."
              requirements={[
                {
                  title: "Government ID",
                  body: "Aadhaar, PAN, passport, or driving licence to confirm who you are.",
                },
                {
                  title: "Proof of ownership",
                  body: "An electricity bill, sale deed, or property-tax receipt in your name.",
                },
              ]}
              done="Your listings now carry the green verified tick."
            />
            <VerifyCard
              side="Tenants"
              accent="forest"
              intro="Contact owners directly and request a visit with confidence."
              requirements={[
                {
                  title: "Government ID",
                  body: "Aadhaar, PAN, passport, or driving licence, that is all we need.",
                },
                {
                  title: "Nothing else",
                  body: "No income proofs, no broker forms, no phone number shared until you both agree.",
                },
              ]}
              done="Owners can now see you are a verified tenant."
            />
          </div>
        </div>
      </section>

      {/* Closing reassurance */}
      <section className="py-16 md:py-24 bg-cream/40 border-y border-line">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="text-[0.7rem] uppercase tracking-[0.28em] text-forest mb-3">
                Why it matters
              </div>
              <h2 className="font-display text-[1.8rem] md:text-[2.4rem] leading-tight mb-5">
                A broker-free marketplace only works on trust
              </h2>
              <p className="text-[0.95rem] text-ink-soft leading-relaxed max-w-2xl">
                There is no agent vouching for anyone here, and that is the
                point. Verification replaces the broker: a verified owner is a
                real person who actually owns the home, and a verified tenant is
                a real person you can safely hand the keys to. That is the whole
                deal, owner to tenant, directly.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/host"
                  className="px-6 py-3 bg-clay hover:bg-clay-deep text-paper rounded-full transition-colors text-[0.92rem] text-center"
                >
                  List your home
                </Link>
                <Link
                  href="/stays"
                  className="px-6 py-3 border border-ink rounded-full hover:bg-ink hover:text-paper transition-colors text-[0.92rem] text-center"
                >
                  Browse verified homes
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-paper border border-forest/30 rounded-3xl p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-forest/10 grid place-items-center mb-4">
                  <TickBadge size={34} />
                </div>
                <div className="font-display text-[1.6rem] text-forest leading-tight mb-2">
                  The green tick
                </div>
                <p className="text-[0.9rem] text-ink-soft leading-relaxed">
                  When you see it next to an owner or a tenant, the identity has
                  been checked by Abode. No brokers, no guesswork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function VerifyCard({
  side,
  accent,
  intro,
  requirements,
  done,
}: {
  side: string;
  accent: "clay" | "forest";
  intro: string;
  requirements: { title: string; body: string }[];
  done: string;
}) {
  const [state, setState] = useState<VState>("unverified");

  const start = () => {
    if (state !== "unverified") return;
    setState("pending");
    // demo: pending then verified
    setTimeout(() => setState("verified"), 1600);
  };

  const accentText = accent === "clay" ? "text-clay" : "text-forest";
  const accentBg = accent === "clay" ? "bg-clay" : "bg-forest";
  const accentHover =
    accent === "clay" ? "hover:bg-clay-deep" : "hover:bg-forest/85";

  return (
    <div className="bg-paper border border-line rounded-3xl p-7 md:p-9 flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`text-[0.7rem] uppercase tracking-[0.28em] ${accentText}`}
        >
          {side}
        </div>
        <StatePill state={state} />
      </div>

      <h3 className="font-display text-[1.6rem] md:text-[1.9rem] mt-3 mb-1">
        Verify as {side === "Owners" ? "an owner" : "a tenant"}
      </h3>
      <p className="text-[0.92rem] text-ink-soft leading-relaxed mb-6">
        {intro}
      </p>

      {/* Requirements */}
      <ul className="space-y-3 mb-7">
        {requirements.map((r) => (
          <li key={r.title} className="flex gap-3">
            <span className="mt-0.5 shrink-0">
              <TickBadge size={20} muted={state !== "verified"} />
            </span>
            <span>
              <span className="block text-[0.92rem] font-medium text-ink">
                {r.title}
              </span>
              <span className="block text-[0.85rem] text-ink-soft leading-relaxed">
                {r.body}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Stepper */}
      <Stepper state={state} />

      {/* Action / status */}
      <div className="mt-7">
        {state === "verified" ? (
          <div className="bg-forest/8 border border-forest/30 rounded-2xl p-5 flex items-start gap-3">
            <TickBadge size={24} />
            <div>
              <div className="font-display text-[1.15rem] text-forest leading-tight">
                Verified
              </div>
              <p className="text-[0.85rem] text-ink-soft leading-relaxed mt-0.5">
                {done}
              </p>
            </div>
          </div>
        ) : state === "pending" ? (
          <div className="bg-saffron-soft/40 border border-saffron/50 rounded-2xl p-5 flex items-center gap-3">
            <Spinner />
            <div>
              <div className="font-display text-[1.1rem] text-ink leading-tight">
                Checking your documents
              </div>
              <p className="text-[0.85rem] text-ink-soft leading-relaxed mt-0.5">
                This usually takes a moment. Hang tight.
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={start}
            className={`w-full px-6 py-3 ${accentBg} ${accentHover} text-paper rounded-full transition-colors text-[0.92rem]`}
          >
            Start verification
          </button>
        )}
        <p className="text-[0.78rem] text-ink-faint mt-3">
          Demo flow. Your documents are encrypted and never shared with the
          other party.
        </p>
      </div>
    </div>
  );
}

function Stepper({ state }: { state: VState }) {
  const current = STATES.indexOf(state);
  return (
    <div className="flex items-center">
      {STATES.map((s, i) => {
        const reached = i <= current;
        const isVerified = s === "verified" && reached;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center text-[0.7rem] border transition-colors ${
                  isVerified
                    ? "bg-forest border-forest text-paper"
                    : reached
                    ? "bg-saffron border-saffron text-ink"
                    : "bg-paper border-line text-ink-faint"
                }`}
              >
                {isVerified ? <CheckMark /> : i + 1}
              </div>
              <span
                className={`text-[0.68rem] uppercase tracking-[0.12em] ${
                  reached ? "text-ink" : "text-ink-faint"
                }`}
              >
                {STATE_LABEL[s]}
              </span>
            </div>
            {i < STATES.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 mb-5 ${
                  i < current ? "bg-forest-soft" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatePill({ state }: { state: VState }) {
  const cls =
    state === "verified"
      ? "bg-forest/10 text-forest border-forest/30"
      : state === "pending"
      ? "bg-saffron-soft/50 text-ink border-saffron/50"
      : "bg-cream text-ink-soft border-line";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[0.7rem] px-3 py-1 rounded-full border ${cls}`}
    >
      {state === "verified" && <TickBadge size={13} />}
      {STATE_LABEL[state]}
    </span>
  );
}

/* ---------- inline SVG motifs ---------- */

function TickBadge({ size = 20, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={muted ? "text-ink-faint" : "text-forest"}
    >
      <path
        d="M12 2l2.4 1.7 2.9-.3 1.2 2.7 2.6 1.4-.5 2.9 1.7 2.4-1.7 2.4.5 2.9-2.6 1.4-1.2 2.7-2.9-.3L12 22l-2.4-1.7-2.9.3-1.2-2.7-2.6-1.4.5-2.9L2.2 11l1.7-2.4-.5-2.9 2.6-1.4 1.2-2.7 2.9.3L12 2z"
        fill="currentColor"
        opacity={muted ? 0.18 : 0.16}
      />
      <path
        d="M12 2l2.4 1.7 2.9-.3 1.2 2.7 2.6 1.4-.5 2.9 1.7 2.4-1.7 2.4.5 2.9-2.6 1.4-1.2 2.7-2.9-.3L12 22l-2.4-1.7-2.9.3-1.2-2.7-2.6-1.4.5-2.9L2.2 11l1.7-2.4-.5-2.9 2.6-1.4 1.2-2.7 2.9.3L12 2z"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity={muted ? 0.4 : 1}
      />
      <path
        d="M8.4 12.2l2.4 2.4 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-saffron"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" opacity="0.25" />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
