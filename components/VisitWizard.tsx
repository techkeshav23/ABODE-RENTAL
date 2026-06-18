"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { getOwner } from "@/lib/data";
import { canRequestVisit, newRequestId, saveRequest } from "@/lib/storage";

const SLOTS = ["Morning · 9–12", "Afternoon · 12–4", "Evening · 4–8"];
const STEPS = ["Schedule", "Verify identity", "Confirm"];

const formatAadhaar = (digits: string) =>
  digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

export function VisitWizard({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const owner = getOwner(property.ownerId);
  const today = new Date().toISOString().slice(0, 10);

  const [step, setStep] = useState(1); // 1..3, 4 = success

  // Render via a portal at <body> so the modal escapes the <main z-10> stacking
  // context — otherwise the z-40 Header/BottomNav (siblings of <main>) paint over it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden"; // lock background scroll while open
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // step 1
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState(
    `Hi, I'm interested in ${property.name}. Is it still available?`
  );

  // step 2 — KYC
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [aadhaar, setAadhaar] = useState(""); // digits only
  const [idDocName, setIdDocName] = useState("");
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState("");

  const phoneOk = /^\d{10}$/.test(phone);
  const aadhaarOk = aadhaar.length === 12;

  const step1Ok = visitDate && visitSlot;
  const step2Ok = name && phoneVerified && aadhaarOk && idDocName && consent;

  const submit = () => {
    const gate = canRequestVisit(property.slug);
    if (!gate.ok) {
      setError(gate.reason ?? "Visit limit reached.");
      return;
    }
    saveRequest({
      id: newRequestId(),
      propertyId: property.id,
      propertySlug: property.slug,
      propertyName: property.name,
      propertyImage: property.images[0],
      city: property.city,
      neighborhood: property.neighborhood,
      ownerName: owner?.name ?? "Owner",
      rent: property.rent,
      visitDate,
      visitSlot,
      moveInDate,
      message,
      tenantName: name,
      tenantPhone: phone,
      aadhaarLast4: aadhaar.slice(-4),
      idDocName,
      verified: true,
      status: "requested",
      createdAt: new Date().toISOString(),
    });
    setStep(4);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-5"
      onClick={onClose}
    >
      <div
        className="bg-paper w-full md:max-w-lg h-[100dvh] md:h-auto md:max-h-[88dvh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 bg-paper border-b border-line px-4 sm:px-6 py-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-[0.66rem] uppercase tracking-[0.2em] text-clay">
              Request a visit
            </div>
            <h2 className="font-display text-[1.05rem] leading-tight">{property.name}</h2>
            <p className="text-[0.8rem] text-ink-soft">
              {property.neighborhood}, {property.city}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-cream text-ink-soft shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable middle — footer below always stays pinned/visible */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
        {step <= 3 && (
          <div className="px-4 sm:px-6 pt-4">
            <Stepper step={step} />
          </div>
        )}

        <div className="px-4 sm:px-6 py-4">
          {/* STEP 1 — SCHEDULE */}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Pick a visit day">
                <input
                  type="date"
                  min={today}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink"
                />
              </Field>
              <Field label="Pick a time slot">
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setVisitSlot(s)}
                      className={`px-2 py-2.5 rounded-lg text-[0.82rem] border text-center leading-tight transition-colors ${
                        visitSlot === s
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper text-ink-soft border-line hover:border-ink"
                      }`}
                    >
                      {s.split(" · ")[0]}
                      <span className="block text-[0.68rem] opacity-70">{s.split(" · ")[1]}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Planned move-in (optional)">
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink"
                />
              </Field>
              <Field label="Message to owner">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink resize-none"
                />
              </Field>
            </div>
          )}

          {/* STEP 2 — VERIFY IDENTITY (KYC) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-[0.82rem] text-ink-soft bg-forest/5 border border-forest/20 rounded-lg p-3">
                <ShieldIcon />
                <span>
                  Tenants verify their identity so owners know exactly who is visiting —
                  this is what replaces a broker's "screening", and keeps fake renters out.
                </span>
              </div>

              <Field label="Full name (as per ID)">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink"
                />
              </Field>

              <Field label="Mobile number">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    disabled={phoneVerified}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit number"
                    className="flex-1 bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink disabled:opacity-60"
                  />
                  {!phoneVerified && (
                    <button
                      type="button"
                      disabled={!phoneOk}
                      onClick={() => setOtpSent(true)}
                      className="px-3 rounded-lg border border-ink text-[0.82rem] disabled:opacity-40"
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                  {phoneVerified && (
                    <span className="inline-flex items-center gap-1 px-3 text-[0.82rem] text-forest">
                      <TickIcon /> Verified
                    </span>
                  )}
                </div>
                {otpSent && !phoneVerified && (
                  <div className="flex gap-2 mt-2">
                    <input
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP (demo: any 6 digits)"
                      className="flex-1 bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      disabled={otp.length !== 6}
                      onClick={() => setPhoneVerified(true)}
                      className="px-3 rounded-lg bg-ink text-paper text-[0.82rem] disabled:opacity-40"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </Field>

              <Field label="Aadhaar number">
                <input
                  inputMode="numeric"
                  value={formatAadhaar(aadhaar)}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  placeholder="1234 5678 9012"
                  className="w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.95rem] tracking-wider outline-none focus:border-ink"
                />
                <p className="text-[0.72rem] text-ink-faint mt-1">
                  We store only the last 4 digits (••••&nbsp;••••&nbsp;{aadhaar.slice(-4) || "0000"}) — never the full number.
                </p>
              </Field>

              <Field label="Upload a government ID (Aadhaar / PAN / DL)">
                <label className="flex items-center gap-3 bg-cream/60 border border-dashed border-line rounded-lg px-3 py-3 cursor-pointer hover:border-ink">
                  <UploadIcon />
                  <span className="text-[0.88rem] text-ink-soft truncate">
                    {idDocName || "Choose file (PDF / JPG / PNG)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setIdDocName(e.target.files?.[0]?.name ?? "")}
                  />
                </label>
                {idDocName && (
                  <p className="text-[0.74rem] text-forest mt-1 inline-flex items-center gap-1">
                    <TickIcon /> {idDocName} attached
                  </p>
                )}
              </Field>

              <label className="flex items-start gap-2.5 text-[0.82rem] text-ink-soft">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-forest"
                />
                <span>
                  I consent to Abode verifying my identity for this visit, and confirm the
                  details are correct (per the DPDP Act, 2023). My documents are shared only
                  with the verified owner.
                </span>
              </label>
            </div>
          )}

          {/* STEP 3 — CONFIRM */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-line overflow-hidden">
                <Row k="Home" v={property.name} />
                <Row k="Owner" v={`${owner?.name} (Verified)`} />
                <Row k="Visit" v={`${visitDate} · ${visitSlot.split(" · ")[0]}`} />
                {moveInDate && <Row k="Move-in" v={moveInDate} />}
                <Row k="Name" v={name} />
                <Row k="Mobile" v={`${phone} ✓ verified`} />
                <Row k="Aadhaar" v={`•••• •••• ${aadhaar.slice(-4)}`} />
                <Row k="ID document" v={idDocName} last />
              </div>
              <div className="flex items-center gap-2 text-[0.82rem] text-forest bg-forest/5 border border-forest/20 rounded-lg p-3">
                <ShieldIcon />
                You'll be marked a <strong>Verified tenant</strong>. This request goes
                directly to {owner?.name} — no broker, no brokerage.
              </div>
              {error && (
                <p className="text-[0.82rem] text-clay bg-clay/5 border border-clay/20 rounded-lg p-3">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-forest text-paper grid place-items-center mb-3">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l4 4L19 7" />
                </svg>
              </div>
              <div className="font-display text-[1.4rem] mb-1">Visit scheduled</div>
              <p className="text-[0.9rem] text-ink-soft max-w-sm mx-auto">
                You're now a <strong className="text-forest">Verified tenant</strong>. Your{" "}
                {visitSlot.split(" · ")[0].toLowerCase()} visit request went directly to{" "}
                <strong>{owner?.name}</strong>. Track it under{" "}
                <Link href="/bookings" className="text-clay underline" onClick={onClose}>
                  My requests
                </Link>
                .
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 bg-ink text-paper rounded-full text-[0.9rem]"
              >
                Done
              </button>
            </div>
          )}
        </div>
        </div>

        {/* Footer nav — pinned, never clipped */}
        {step <= 3 && (
          <div className="shrink-0 bg-paper border-t border-line px-4 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
            <button
              onClick={() => (step === 1 ? onClose() : setStep((s) => s - 1))}
              className="px-4 py-2.5 text-[0.88rem] text-ink-soft hover:text-ink"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            {step < 3 ? (
              <button
                disabled={step === 1 ? !step1Ok : !step2Ok}
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 bg-clay hover:bg-clay-deep disabled:opacity-40 disabled:cursor-not-allowed text-paper rounded-full text-[0.9rem] font-medium"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                className="px-6 py-2.5 bg-forest hover:opacity-90 text-paper rounded-full text-[0.9rem] font-medium inline-flex items-center gap-2"
              >
                <TickIcon /> Confirm &amp; send request
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center text-[0.78rem] font-medium border-2 ${
                  done
                    ? "bg-forest border-forest text-paper"
                    : active
                    ? "bg-ink border-ink text-paper"
                    : "bg-paper border-line text-ink-faint"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`mt-1 text-[0.68rem] whitespace-nowrap ${
                  active ? "text-ink font-medium" : "text-ink-faint"
                }`}
              >
                {label}
              </span>
            </div>
            {n < STEPS.length && (
              <div className={`flex-1 h-[2px] mx-2 mb-4 ${step > n ? "bg-forest" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
        {label}
      </span>
      {children}
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 px-4 py-2.5 ${last ? "" : "border-b border-line-soft"}`}>
      <span className="text-[0.82rem] text-ink-faint">{k}</span>
      <span className="text-[0.88rem] text-ink text-right truncate">{v}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#264d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
    </svg>
  );
}
function TickIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4 4L19 7" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft shrink-0">
      <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
    </svg>
  );
}
