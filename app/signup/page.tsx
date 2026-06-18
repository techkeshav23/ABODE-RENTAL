"use client";

import Link from "next/link";
import { useState } from "react";

type Role = "tenant" | "owner";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("tenant");

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 sm:px-5 py-10 sm:py-12 pb-24 md:pb-12">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-6 sm:p-7 md:p-9">
        <h1 className="font-display text-[1.9rem] md:text-[2.2rem] leading-tight mb-2">
          Create account
        </h1>
        <p className="text-[0.92rem] text-ink-soft mb-6">
          Save listings, contact owners and request visits without re-typing your details every time.
        </p>

        <div className="mb-6">
          <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint mb-2">
            I am a
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-cream/50 border border-line-soft rounded-xl p-1">
            <RoleOption
              active={role === "tenant"}
              onClick={() => setRole("tenant")}
              title="Tenant"
              hint="looking for a home"
            />
            <RoleOption
              active={role === "owner"}
              onClick={() => setRole("owner")}
              title="Owner"
              hint="listing my home"
            />
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="First name">
              <input className={fieldClass} placeholder="First name" />
            </Field>
            <Field label="Last name">
              <input className={fieldClass} placeholder="Last name" />
            </Field>
          </div>
          <Field label="Email">
            <input className={fieldClass} placeholder="you@example.com" />
          </Field>
          <Field label="Phone">
            <input className={fieldClass} placeholder="+91 98xxxxxxxx" />
          </Field>
          <Field label="Password">
            <input
              type="password"
              className={fieldClass}
              placeholder="At least 8 characters"
            />
          </Field>

          <label className="flex items-start gap-2 text-[0.82rem] text-ink-soft pt-1">
            <input type="checkbox" className="mt-1" defaultChecked />
            <span>
              I agree to the{" "}
              <Link href="#" className="underline">
                terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline">
                privacy policy
              </Link>
              .
            </span>
          </label>

          <button className="w-full bg-clay hover:bg-clay-deep text-paper rounded-full py-3 transition-colors text-[0.95rem]">
            {role === "owner" ? "Create owner account" : "Create tenant account"}
          </button>
        </form>

        <p className="mt-4 text-[0.78rem] text-ink-faint text-center leading-relaxed">
          Every Abode account is identity-verified — owners also verify ownership. No brokers allowed.
        </p>

        <div className="mt-6 text-[0.9rem] text-ink-soft text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-clay underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full bg-cream/50 border border-line-soft rounded-xl px-4 py-3 text-[0.95rem] outline-none focus:border-ink transition-colors";

function RoleOption({
  active,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-2.5 text-left transition-colors ${
        active
          ? "bg-paper border border-clay text-ink shadow-sm"
          : "border border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      <span className="block text-[0.9rem] font-medium">{`I'm a ${title}`}</span>
      <span className="block text-[0.74rem] text-ink-faint">{hint}</span>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
