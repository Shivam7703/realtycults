// Path: component/projects/ProjectGallery.tsx

"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProjectGallery({ images, title }: Props) {
  const [active, setActive] = useState<number>(0);

  if (images.length === 0) return null;

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[active]}
        alt={`${title} - image ${active + 1}`}
        className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md"
      />

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1} dekho`}
              className={`overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-amber-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}