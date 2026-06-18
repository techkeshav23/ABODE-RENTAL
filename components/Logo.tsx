import Link from "next/link";

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <Link href="/" className={`inline-flex items-center gap-1.5 ${color}`}>
      <BirdMark className="h-5 w-5" />
      <span className="font-display text-[1.5rem] leading-none tracking-tight">
        abode
      </span>
    </Link>
  );
}

function BirdMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M5 19c2.5-3 5.5-4.5 9-4.5 3 0 5 1 6 2.5l5-3-2 4 4-1-3 3.5c-1.5 4-5 6-9.5 6-5 0-8.5-3-9.5-7.5z"
        fill="currentColor"
      />
      <circle cx="22.5" cy="16.4" r="0.9" fill="var(--color-paper)" />
    </svg>
  );
}
