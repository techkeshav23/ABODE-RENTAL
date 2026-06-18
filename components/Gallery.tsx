"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const list = images.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:h-[520px] rounded-3xl overflow-hidden">
        <button
          onClick={() => setOpen(0)}
          className="relative aspect-[4/3] md:aspect-auto md:col-span-2 md:row-span-2 group bg-cream-deep"
        >
          <Image
            src={list[0]}
            alt={`${alt} 1`}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
        </button>
        {list.slice(1, 5).map((src, i) => (
          <button
            key={i}
            onClick={() => setOpen(i + 1)}
            className="relative hidden md:block group bg-cream-deep"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center text-paper font-display text-[1.4rem]">
                +{images.length - 5} more
              </div>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o - 1 + images.length) % images.length));
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper text-2xl"
            aria-label="prev"
          >
            ‹
          </button>
          <div className="relative max-w-5xl w-full aspect-[3/2]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open]}
              alt={`${alt} ${open + 1}`}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o + 1) % images.length));
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper text-2xl"
            aria-label="next"
          >
            ›
          </button>
          <button
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 text-paper/80 hover:text-paper text-[0.92rem]"
          >
            Close ✕
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-paper/70 text-[0.85rem]">
            {open + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
