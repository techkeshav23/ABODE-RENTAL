"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Phase = "form" | "processing" | "done";

export function PaymentSheet({
  amount,
  onSuccess,
  onClose,
}: {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [method, setMethod] = useState<"card" | "upi">("card");
  const [phase, setPhase] = useState<Phase>("form");

  // card
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  // upi
  const [upi, setUpi] = useState("");

  const cardOk = card.replace(/\s/g, "").length >= 12 && /^\d\d\/\d\d$/.test(exp) && cvv.length >= 3;
  const upiOk = /^[\w.-]+@[\w.-]+$/.test(upi);
  const canPay = method === "card" ? cardOk : upiOk;

  const pay = () => {
    if (!canPay) return;
    setPhase("processing");
    // demo gateway delay
    setTimeout(() => {
      setPhase("done");
      setTimeout(onSuccess, 900);
    }, 1400);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-5"
      onClick={phase === "form" ? onClose : undefined}
    >
      <div
        className="bg-paper w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gateway header */}
        <div className="bg-ink text-paper px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 grid place-items-center rounded-md bg-clay font-display text-[0.95rem]">
              A
            </span>
            <div className="leading-tight">
              <div className="text-[0.92rem] font-medium">Abode Pay</div>
              <div className="text-[0.66rem] text-paper/60">Secure demo checkout</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-[1.2rem]">₹{amount}</div>
            <div className="text-[0.62rem] text-paper/60">refundable token</div>
          </div>
        </div>

        {phase === "done" ? (
          <div className="px-5 py-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-forest text-paper grid place-items-center mb-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l4 4L19 7" />
              </svg>
            </div>
            <div className="font-display text-[1.2rem]">Payment successful</div>
            <div className="text-[0.82rem] text-ink-soft mt-1">₹{amount} token paid · confirming your visit…</div>
          </div>
        ) : phase === "processing" ? (
          <div className="px-5 py-10 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-[3px] border-line border-t-clay animate-spin" />
            <div className="text-[0.9rem] text-ink-soft">Processing payment…</div>
            <div className="text-[0.72rem] text-ink-faint mt-1">Do not close this window</div>
          </div>
        ) : (
          <div className="px-5 py-5">
            {/* method tabs */}
            <div className="grid grid-cols-2 gap-1.5 mb-4 p-1 bg-cream rounded-lg">
              {(["card", "upi"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 rounded-md text-[0.85rem] font-medium transition-colors ${
                    method === m ? "bg-paper text-ink shadow-sm" : "text-ink-soft"
                  }`}
                >
                  {m === "card" ? "Card" : "UPI"}
                </button>
              ))}
            </div>

            {method === "card" ? (
              <div className="space-y-2.5">
                <Inp
                  value={card}
                  onChange={(v) =>
                    setCard(v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))
                  }
                  placeholder="Card number"
                  mono
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <Inp
                    value={exp}
                    onChange={(v) => {
                      const d = v.replace(/\D/g, "").slice(0, 4);
                      setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                    }}
                    placeholder="MM/YY"
                    mono
                  />
                  <Inp value={cvv} onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))} placeholder="CVV" mono />
                </div>
              </div>
            ) : (
              <Inp value={upi} onChange={setUpi} placeholder="yourname@upi" />
            )}

            <button
              type="button"
              disabled={!canPay}
              onClick={pay}
              className="w-full mt-4 bg-clay hover:bg-clay-deep disabled:opacity-40 disabled:cursor-not-allowed text-paper rounded-xl py-3 text-[0.95rem] font-medium transition-colors"
            >
              Pay ₹{amount}
            </button>
            <button onClick={onClose} className="w-full mt-2 text-[0.82rem] text-ink-soft hover:text-ink py-1">
              Cancel
            </button>
            <p className="mt-2 text-center text-[0.7rem] text-ink-faint">
              🔒 Demo gateway — no real charge. Use any test card / UPI.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function Inp({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={mono ? "numeric" : "text"}
      className={`w-full bg-cream/60 border border-line-soft rounded-lg px-3 py-2.5 text-[0.92rem] outline-none focus:border-ink ${
        mono ? "tracking-wider" : ""
      }`}
    />
  );
}
