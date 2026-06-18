import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-7 md:p-9">
        <h1 className="font-display text-[1.9rem] md:text-[2.2rem] leading-tight mb-2">
          Welcome back
        </h1>
        <p className="text-[0.92rem] text-ink-soft mb-7">
          Sign in to reach verified owners directly — no brokers, no
          middlemen.
        </p>

        <form className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              placeholder="you@example.com"
              className={fieldClass}
            />
          </Field>
          <Field
            label="Password"
            right={
              <Link href="#" className="text-[0.78rem] text-clay hover:underline">
                Forgot?
              </Link>
            }
          >
            <input type="password" className={fieldClass} />
          </Field>
          <button
            type="submit"
            className="w-full bg-ink text-paper rounded-full py-3 hover:bg-clay-deep transition-colors text-[0.95rem] mt-2"
          >
            Sign in
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[0.78rem] text-ink-faint">
          <div className="flex-1 h-px bg-line" />
          or
          <div className="flex-1 h-px bg-line" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-line rounded-full text-[0.85rem] hover:bg-cream">
            <GoogleGlyph /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-line rounded-full text-[0.85rem] hover:bg-cream">
            <AppleGlyph /> Apple
          </button>
        </div>

        <div className="mt-7 text-[0.9rem] text-ink-soft text-center">
          New to Abode?{" "}
          <Link href="/signup" className="text-clay underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full bg-cream/50 border border-line-soft rounded-xl px-4 py-3 text-[0.95rem] outline-none focus:border-ink transition-colors";

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint mb-2">
        {label}
        {right}
      </span>
      {children}
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18">
      <path
        d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.7v2.2h2.9c1.7-1.5 2.7-3.8 2.7-6.6z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 16 5.5 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.9 10.7c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V5H.9C.3 6.2 0 7.6 0 9s.3 2.8.9 4l3-2.3z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.4 2 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"
        fill="#EA4335"
      />
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.4 12.5c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-2-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6C2 12.8 3.2 17.7 5 20.4c.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2.1.8 3.5.8 1.4 0 2.4-1.3 3.2-2.5.7-.9 1.4-2.2 1.5-3.5-1.5-.6-2.5-2-2.5-4.5z" />
    </svg>
  );
}
