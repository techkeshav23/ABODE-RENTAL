"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import {
  getRequests,
  getFavorites,
  onRequestsChange,
  onFavoritesChange,
} from "@/lib/storage";

const SUGGEST = [
  "Bengaluru",
  "Mumbai",
  "Pune",
  "New Delhi",
  "Gurugram",
  "Hyderabad",
  "Chennai",
];

export function Header() {
  const router = useRouter();
  const path = usePathname() ?? "/";
  const [q, setQ] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => {
      setSavedCount(getFavorites().length);
      setRequestsCount(getRequests().filter((r) => r.status !== "cancelled").length);
    };
    refresh();
    const off1 = onFavoritesChange(refresh);
    const off2 = onRequestsChange(refresh);
    return () => {
      off1();
      off2();
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!signInRef.current?.contains(e.target as Node)) setSignInOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
  }, [path]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("city", q.trim());
    router.push(`/stays?${params.toString()}`);
    setShowSuggest(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-lg border-b border-line">
      <div className="mx-auto max-w-[1500px] px-4 lg:px-8">
        <div className="flex items-center gap-3 lg:gap-5 h-[64px]">
          <Logo />

          <form
            onSubmit={submit}
            className="hidden md:flex flex-1 min-w-0 md:max-w-[280px] lg:max-w-[640px] mx-auto"
          >
            <div className="relative w-full">
              <div className="flex items-center bg-cream/70 hover:bg-cream border border-line hover:border-ink/40 rounded-full overflow-hidden transition-colors focus-within:border-ink focus-within:bg-paper">
                <svg
                  className="ml-4 text-ink-soft shrink-0"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5L21 21" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setShowSuggest(true);
                  }}
                  onFocus={() => setShowSuggest(true)}
                  onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                  placeholder="Search city, area, or property"
                  className="flex-1 bg-transparent px-3 py-2.5 text-[0.92rem] outline-none placeholder:text-ink-faint"
                />
                <button
                  type="submit"
                  className="bg-clay hover:bg-clay-deep text-paper px-5 py-2.5 text-[0.85rem] transition-colors"
                >
                  Search
                </button>
              </div>
              {showSuggest && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-paper border border-line rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                    Popular cities
                  </div>
                  {SUGGEST.filter((c) =>
                    c.toLowerCase().includes(q.toLowerCase())
                  ).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setQ(c);
                        const params = new URLSearchParams({ city: c });
                        router.push(`/stays?${params.toString()}`);
                        setShowSuggest(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-cream text-[0.92rem] inline-flex items-center gap-3"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="text-ink-faint"
                      >
                        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zM12 12a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          <nav className="hidden md:flex shrink-0 items-center gap-0.5 lg:gap-2 text-[0.85rem]">
            <Link
              href="/nearby"
              className="px-3 py-2 text-ink-soft hover:text-ink whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Nearby
            </Link>
            <span className="text-ink-faint">·</span>
            <Link
              href="/host"
              className="px-3 py-2 text-ink-soft hover:text-ink whitespace-nowrap"
            >
              List your home
            </Link>
            <span className="text-ink-faint">·</span>
            <span className="px-2 text-ink-soft inline-flex items-center gap-1 cursor-default">
              ₹ INR
            </span>
            <span className="text-ink-faint">·</span>

            <div ref={signInRef} className="relative">
              <button
                onClick={() => setSignInOpen((o) => !o)}
                className="px-3 py-2 text-left flex flex-col leading-tight rounded-lg hover:bg-cream transition-colors"
              >
                <span className="text-[0.7rem] text-ink-faint">Hello,</span>
                <span className="text-[0.88rem] text-ink font-medium inline-flex items-center gap-1">
                  Sign in{" "}
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                    className={`transition-transform ${
                      signInOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M5 7L1 3h8z" />
                  </svg>
                </span>
              </button>
              {signInOpen && (
                <div className="absolute right-0 top-full mt-2 w-[260px] bg-paper border border-line rounded-xl shadow-xl py-3 z-50">
                  <div className="px-4 pb-3 border-b border-line-soft">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-2.5 bg-clay hover:bg-clay-deep text-paper rounded-full text-[0.88rem]"
                    >
                      Sign in
                    </Link>
                    <p className="text-[0.78rem] text-ink-soft mt-2 text-center">
                      New customer?{" "}
                      <Link href="/signup" className="text-clay underline">
                        Start here
                      </Link>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 px-4 pt-3 text-[0.85rem]">
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint mb-2">
                        Your account
                      </div>
                      <DropLink href="/profile">Account</DropLink>
                      <DropLink href="/bookings">My requests</DropLink>
                      <DropLink href="/saved">Saved homes</DropLink>
                    </div>
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint mb-2">
                        For owners
                      </div>
                      <DropLink href="/host">List your home</DropLink>
                      <DropLink href="/verify">Get verified</DropLink>
                      <DropLink href="#">Owner help</DropLink>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/saved"
              className="relative px-3 py-2 text-left flex flex-col leading-tight rounded-lg hover:bg-cream transition-colors"
              aria-label="Saved"
            >
              <span className="text-[0.7rem] text-ink-faint">Your</span>
              <span className="text-[0.88rem] text-ink font-medium inline-flex items-center gap-1">
                <HeartIcon /> Saved
              </span>
              {savedCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 min-w-[18px] h-[18px] px-1 bg-clay text-paper text-[0.65rem] grid place-items-center rounded-full leading-none">
                  {savedCount > 9 ? "9+" : savedCount}
                </span>
              )}
            </Link>

            <Link
              href="/bookings"
              className="relative px-3 py-2 text-left flex flex-col leading-tight rounded-lg hover:bg-cream transition-colors"
              aria-label="Requests"
            >
              <span className="text-[0.7rem] text-ink-faint">Your</span>
              <span className="text-[0.88rem] text-ink font-medium inline-flex items-center gap-1">
                <BagIcon /> Requests
              </span>
              {requestsCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 min-w-[18px] h-[18px] px-1 bg-clay text-paper text-[0.65rem] grid place-items-center rounded-full leading-none">
                  {requestsCount > 9 ? "9+" : requestsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile right cluster */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            <Link
              href="/saved"
              className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-cream"
              aria-label="Saved"
            >
              <HeartIcon />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-clay text-paper text-[0.6rem] grid place-items-center rounded-full leading-none">
                  {savedCount > 9 ? "9+" : savedCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenu((m) => !m)}
              className="w-10 h-10 grid place-items-center rounded-full hover:bg-cream"
              aria-label="Menu"
            >
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none">
                <path
                  d="M0 1h20M0 7h20M0 13h20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <form onSubmit={submit} className="md:hidden pb-3">
          <div className="flex items-center bg-cream/70 border border-line rounded-full overflow-hidden">
            <svg
              className="ml-4 text-ink-soft shrink-0"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search city, area, or property"
              className="flex-1 bg-transparent px-3 py-2.5 text-[0.92rem] outline-none"
            />
            <button className="bg-clay text-paper px-4 py-2.5 text-[0.85rem]">
              Go
            </button>
          </div>
        </form>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenu && (
        <div className="md:hidden border-t border-line bg-paper max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="px-4 py-3 space-y-1 text-[0.95rem]">
            <MLink href="/nearby">Search nearby (map)</MLink>
            <MLink href="/profile">Account</MLink>
            <MLink href="/bookings">My requests</MLink>
            <MLink href="/saved">Saved homes</MLink>
            <MLink href="/host">List your home</MLink>
            <MLink href="/verify">Get verified</MLink>
            <hr className="border-line-soft my-2" />
            <MLink href="/login">Sign in</MLink>
            <MLink href="/signup">Sign up</MLink>
          </div>
        </div>
      )}
    </header>
  );
}

function DropLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block py-1.5 text-ink-soft hover:text-clay text-[0.85rem]"
    >
      {children}
    </Link>
  );
}

function MLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="block py-2.5 px-2 hover:bg-cream rounded-lg">
      {children}
    </Link>
  );
}

function HeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7.5-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
