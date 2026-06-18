"use client";

import Image from "next/image";
import { useState } from "react";

export function CardGallery({
  images,
  alt,
  sizes = "(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw",
}: {
  images: string[];
  alt: string;
  sizes?: string;
}) {
  const list = images.length ? images : [""];
  const [i, setI] = useState(0);

  const go = (e: React.MouseEvent, dir: number) => {
    e.preventDefault();
    e.stopPropagation();
    setI((c) => (c + dir + list.length) % list.length);
  };
  const dot = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setI(idx);
  };

  return (
    <>
      <Image
        src={list[i]}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {list.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(e, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-7 md:h-7 grid place-items-center rounded-full bg-paper/90 text-ink text-lg md:text-base shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-paper transition-opacity"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(e, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-7 md:h-7 grid place-items-center rounded-full bg-paper/90 text-ink text-lg md:text-base shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-paper transition-opacity"
          >
            ›
          </button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
            {list.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 md:w-1.5 md:h-1.5 rounded-full transition-colors ${
                  idx === i ? "bg-paper" : "bg-paper/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
