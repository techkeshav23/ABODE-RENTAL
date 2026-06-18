"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Tell us about your home",
    body: "Title, city, locality, rent, deposit, bedrooms, furnishing. A few phone snaps are plenty to get started.",
  },
  {
    n: "02",
    title: "We verify you",
    body: "Every owner gets their identity and ownership checked before going live. No brokers, ever.",
  },
  {
    n: "03",
    title: "Your listing goes live",
    body: "Once verified, your home appears in search. You stay in control and can edit anytime.",
  },
  {
    n: "04",
    title: "Hear from verified tenants",
    body: "Verified tenants send visit requests in-app. You reply directly, on your terms.",
  },
];

const PERKS = [
  { big: "0", label: "Brokerage. You list directly." },
  { big: "0", label: "Listing fee" },
  { big: "100%", label: "Owners verified before going live" },
  { big: "Direct", label: "Verified tenants, no middlemen" },
];

const CITY_OPTIONS = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

export default function HostPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10 py-16 md:py-24">
          <div className="text-[0.7rem] uppercase tracking-[0.32em] text-clay mb-5">
            For home owners
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <h1 className="lg:col-span-8 font-display text-[2.2rem] md:text-[3.4rem] lg:text-[4.2rem] leading-[0.98] tracking-tight">
              List your home. No broker, zero brokerage.
            </h1>
            <p className="lg:col-span-4 text-[1rem] leading-relaxed text-ink-soft max-w-md">
              Owners list directly on Abode. We verify your identity and ownership before your home goes live, then verified tenants reach you directly with visit requests.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PERKS.map((p) => (
              <div
                key={p.label}
                className="bg-paper border border-line rounded-2xl p-5"
              >
                <div className="font-display text-[1.8rem] leading-none text-clay">
                  {p.big}
                </div>
                <div className="mt-2 text-[0.85rem] text-ink-soft">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            <h2 className="lg:col-span-7 font-display text-[1.8rem] md:text-[2.6rem] leading-tight">
              How it works
            </h2>
            <p className="lg:col-span-5 text-[1rem] text-ink-soft leading-relaxed">
              Abode is broker-free by design. Owners list directly, every owner is verified, and only verified tenants can request a visit, so the people you hear from are real.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  className="font-display text-[3.6rem] leading-none text-clay/20"
                  aria-hidden
                >
                  {s.n}
                </div>
                <div className="mt-2">
                  <h3 className="font-display text-[1.3rem] mb-2">{s.title}</h3>
                  <p className="text-[0.92rem] text-ink-soft leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream/40 border-y border-line">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="text-[0.7rem] uppercase tracking-[0.28em] text-clay mb-3">
                Start in 2 minutes
              </div>
              <h2 className="font-display text-[1.8rem] md:text-[2.4rem] leading-tight mb-5">
                Tell us about your home
              </h2>
              <p className="text-[0.95rem] text-ink-soft leading-relaxed">
                Add the basics now. Once you submit, we verify your ID and ownership, then your listing goes live and verified tenants can request a visit directly.
              </p>
              <div className="mt-7 p-5 bg-paper border border-line rounded-2xl">
                <div className="text-[0.78rem] uppercase tracking-[0.18em] text-clay mb-2">
                  Verified, broker-free
                </div>
                <p className="text-[0.9rem] text-ink-soft leading-relaxed">
                  No brokers and no brokerage. Every owner is identity and ownership verified, and you only ever hear from verified tenants, never a middleman.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              {sent ? (
                <div className="bg-paper border border-forest rounded-3xl p-10 text-center">
                  <div className="font-display text-[1.8rem] text-forest leading-tight mb-3">
                    Listing submitted.
                  </div>
                  <p className="text-[0.95rem] text-ink-soft max-w-md mx-auto">
                    We&apos;ll verify your ID and ownership, then it goes live. Once it&apos;s up, verified tenants can send you visit requests directly.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="px-6 py-3 bg-clay hover:bg-clay-deep text-paper rounded-full transition-colors text-[0.92rem]"
                    >
                      List another home
                    </button>
                    <Link
                      href="/stays"
                      className="text-[0.9rem] text-clay underline underline-offset-4"
                    >
                      Browse live listings
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="bg-paper border border-line rounded-3xl p-7 md:p-9 space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Your name" required>
                      <input
                        required
                        className={fieldClass}
                        placeholder="Full name"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        className={fieldClass}
                        placeholder="you@example.com"
                      />
                    </Field>
                  </div>
                  <Field label="Listing title" required>
                    <input
                      required
                      className={fieldClass}
                      placeholder="e.g. Sunlit 2BHK near the lake"
                    />
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="City" required>
                      <select required className={fieldClass} defaultValue="">
                        <option value="" disabled>
                          Choose a city
                        </option>
                        {CITY_OPTIONS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Locality" required>
                      <input
                        required
                        className={fieldClass}
                        placeholder="e.g. Koramangala 5th block"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Monthly rent (₹)" required>
                      <input
                        required
                        type="number"
                        min={0}
                        className={fieldClass}
                        placeholder="e.g. 35000"
                      />
                    </Field>
                    <Field label="Deposit (₹)" required>
                      <input
                        required
                        type="number"
                        min={0}
                        className={fieldClass}
                        placeholder="e.g. 100000"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Bedrooms" required>
                      <select required className={fieldClass} defaultValue="">
                        <option value="" disabled>
                          Choose
                        </option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </Field>
                    <Field label="Furnishing" required>
                      <select required className={fieldClass} defaultValue="">
                        <option value="" disabled>
                          Choose
                        </option>
                        <option>Furnished</option>
                        <option>Semi-furnished</option>
                        <option>Unfurnished</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Preferred tenants">
                    <select className={fieldClass} defaultValue="Anyone">
                      <option>Anyone</option>
                      <option>Family</option>
                      <option>Bachelors</option>
                    </select>
                  </Field>
                  <Field label="A short description">
                    <textarea
                      className={`${fieldClass} min-h-[100px] resize-y`}
                      placeholder="2BHK in a society building, north-facing, 5 min from the metro..."
                    />
                  </Field>
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-clay hover:bg-clay-deep text-paper rounded-full transition-colors text-[0.92rem]"
                    >
                      Submit listing
                    </button>
                    <span className="text-[0.8rem] text-ink-faint">
                      We&apos;ll verify your ID &amp; ownership before it goes live.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const fieldClass =
  "w-full bg-cream/50 border border-line-soft rounded-xl px-4 py-3 text-[0.95rem] outline-none focus:border-ink transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint mb-2">
        {label}
        {required && <span className="text-clay ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
