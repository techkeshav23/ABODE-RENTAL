"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequests, getFavorites, onRequestsChange, onFavoritesChange } from "@/lib/storage";

export function BottomNav() {
  const path = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);

  useEffect(() => {
    const refreshFav = () => setSavedCount(getFavorites().length);
    const refreshRq = () =>
      setRequestsCount(getRequests().filter((r) => r.status !== "cancelled").length);
    refreshFav();
    refreshRq();
    const offFav = onFavoritesChange(refreshFav);
    const offRq = onRequestsChange(refreshRq);
    return () => {
      offFav();
      offRq();
    };
  }, []);

  const items = [
    { href: "/", label: "Home", Icon: HomeIcon },
    { href: "/stays", label: "Explore", Icon: SearchIcon },
    { href: "/nearby", label: "Map", Icon: MapIcon },
    { href: "/bookings", label: "Requests", Icon: TripsIcon, badge: requestsCount },
    { href: "/saved", label: "Saved", Icon: HeartIcon, badge: savedCount },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/95 backdrop-blur-xl border-t border-line"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 4px)" }}
    >
      <div className="flex">
        {items.map((it) => {
          const active =
            it.href === "/" ? path === "/" : path?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex-1 relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                active ? "text-clay" : "text-ink-soft"
              }`}
            >
              <div className="relative">
                <it.Icon active={!!active} />
                {it.badge && it.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 grid place-items-center bg-clay text-paper text-[0.6rem] font-medium rounded-full leading-none">
                    {it.badge > 9 ? "9+" : it.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[0.65rem] tracking-wide">{it.label}</span>
              {active && (
                <span className="absolute top-0 inset-x-6 h-[2px] bg-clay rounded-b" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const C = "currentColor";
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-8.5z" fill={active ? C : "none"} fillOpacity={active ? 0.15 : 0} />
    </svg>
  );
}
function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" fill={active ? C : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}
function TripsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2" fill={active ? C : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" />
    </svg>
  );
}
function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? C : "none"} stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" fill={active ? C : "none"} fillOpacity={active ? 0.15 : 0} />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
