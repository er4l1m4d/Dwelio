"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  title?: string;
};

export default function ImageGallery({
  images,
  title = "Property",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const supportingIndexes = useMemo(() => {
    if (images.length <= 1) return [];

    const indexes: number[] = [];
    let pointer = activeIndex + 1;

    while (indexes.length < 2 && indexes.length < images.length - 1) {
      const nextIndex = pointer % images.length;

      if (nextIndex !== activeIndex && !indexes.includes(nextIndex)) {
        indexes.push(nextIndex);
      }

      pointer += 1;
    }

    return indexes;
  }, [activeIndex, images.length]);

  if (!images.length) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-[2rem] bg-surface-container-low text-center text-on-surface-variant shadow-[var(--shadow-editorial-card)]">
        No images uploaded for this home yet.
      </div>
    );
  }

  const showSupportingGrid = images.length > 1;

  return (
    <div className="grid gap-4">
      <div
        className={`grid gap-4 ${
          showSupportingGrid ? "md:grid-cols-12" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[2rem] bg-surface-container shadow-[var(--shadow-elevated-panel)] ${
            showSupportingGrid
              ? "min-h-[320px] sm:min-h-[380px] md:col-span-8 md:min-h-[420px]"
              : "min-h-[320px] sm:min-h-[420px] md:min-h-[440px]"
          }`}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,27,15,0.05)_0%,rgba(0,27,15,0.1)_35%,rgba(0,27,15,0.35)_100%)]" />

          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="rounded-full bg-surface-container-lowest/92 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container backdrop-blur-md">
              {images.length} photos
            </span>
          </div>

          <div className="absolute bottom-5 right-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/92 text-primary-container shadow-[var(--shadow-floating-pane)] backdrop-blur-md transition hover:bg-surface-container-low"
              aria-label="Show previous image"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/92 text-primary-container shadow-[var(--shadow-floating-pane)] backdrop-blur-md transition hover:bg-surface-container-low"
              aria-label="Show next image"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {showSupportingGrid && (
          <div className="grid gap-4 md:col-span-4">
            {supportingIndexes.map((index, position) => {
              const remainingCount = images.length - 3;
              const showOverlay =
                position === supportingIndexes.length - 1 &&
                images.length > 3;

              return (
                <button
                  key={`${images[index]}-${position}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group relative min-h-[140px] overflow-hidden rounded-[1.75rem] bg-surface-container shadow-[var(--shadow-editorial-card)] sm:min-h-[180px] md:min-h-[202px]"
                >
                  <Image
                    src={images[index]}
                    alt={`${title} image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,27,15,0.04)_0%,rgba(0,27,15,0.42)_100%)]" />

                  {showOverlay ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary-container/55 px-4 text-center text-on-primary backdrop-blur-sm">
                      <span className="font-headline text-lg font-black uppercase tracking-[0.14em]">
                        View all
                      </span>
                      <span className="text-sm font-semibold">
                        {images.length} photos
                        {remainingCount > 0 ? ` + ${remainingCount} more` : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 rounded-full bg-surface-container-lowest/88 px-3 py-1 text-xs font-bold text-primary-container backdrop-blur-md">
                      {index + 1} / {images.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-[1.25rem] shadow-[var(--shadow-floating-pane)] transition sm:h-20 sm:w-28 ${
                index === activeIndex
                  ? "ring-2 ring-primary-container"
                  : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
