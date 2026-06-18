import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 py-20">
      <div className="text-center max-w-md">
        <div className="font-display text-[5rem] leading-none text-clay tracking-tight">
          404
        </div>
        <div className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint mt-2">
          Page not found
        </div>
        <h1 className="font-display text-[1.8rem] mt-3 mb-3">
          This page does not exist
        </h1>
        <p className="text-ink-soft mb-7 text-[0.95rem]">
          The link may be broken or the page may have been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="px-6 py-3 bg-ink text-paper rounded-full hover:bg-clay-deep transition-colors text-[0.92rem]"
          >
            Go home
          </Link>
          <Link
            href="/stays"
            className="px-6 py-3 border border-ink rounded-full hover:bg-ink hover:text-paper transition-colors text-[0.92rem]"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </div>
  );
}
