"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/60 text-sm text-emerald-800">
        No images uploaded.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white">
        <Image
          src={images[activeIndex]}
          alt={`Property image ${activeIndex + 1}`}
          width={1200}
          height={800}
          className="h-80 w-full object-cover sm:h-[420px]"
        />
        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {activeIndex + 1}/{images.length}
        </div>
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white"
        >
          →
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-20 overflow-hidden rounded-2xl border ${
              index === activeIndex
                ? "border-emerald-600"
                : "border-emerald-100"
            }`}
          >
            <Image src={image} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
