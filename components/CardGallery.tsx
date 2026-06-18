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
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
          {list.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Photo ${idx + 1}`}
              onClick={(e) => dot(e, idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-4 bg-paper" : "w-1.5 bg-paper/60 hover:bg-paper/90"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
