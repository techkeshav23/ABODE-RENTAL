"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite, onFavoritesChange } from "@/lib/storage";

export function SaveButton({
  slug,
  className = "",
  variant = "card",
}: {
  slug: string;
  className?: string;
  variant?: "card" | "detail";
}) {
  const [saved, setSaved] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(slug));
    return onFavoritesChange(() => setSaved(isFavorite(slug)));
  }, [slug]);

  const onClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleFavorite(slug);
    setSaved(now);
    if (now) {
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
    }
  };

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={saved ? "Remove from saved" : "Save"}
        className={`inline-flex items-center gap-2 px-4 py-2.5 border border-line rounded-full text-[0.85rem] hover:border-ink transition-colors ${className}`}
      >
        <Heart filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Remove from saved" : "Save"}
      className={`absolute top-3 right-3 z-10 w-9 h-9 grid place-items-center rounded-full bg-paper/90 backdrop-blur hover:bg-paper transition-all hover:scale-110 ${
        pulse ? "animate-[ping_0.4s_ease-out]" : ""
      } ${className}`}
    >
      <Heart filled={saved} />
    </button>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? "var(--color-clay)" : "none"}
      stroke={filled ? "var(--color-clay)" : "currentColor"}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "" : "text-ink"}
    >
      <path d="M12 21s-7.5-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
