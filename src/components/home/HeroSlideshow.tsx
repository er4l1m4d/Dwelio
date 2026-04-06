"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroSlide = {
  alt: string;
  image: string;
  location: string;
  price: string;
  title: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
};

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];

  return (
    <div className="overflow-hidden rounded-[2.25rem] bg-white/10 shadow-[var(--shadow-elevated-panel)] backdrop-blur-md h-full w-full">
      <div className="relative flex min-h-[360px] sm:min-h-[420px] h-full w-full">
        {/* Image and overlay fill all available space */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={activeSlide.image}
            alt={activeSlide.alt}
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
            quality={78}
            className="object-cover"
          />
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(180deg,rgba(0,27,15,0.08)_0%,rgba(0,27,15,0.22)_35%,rgba(0,27,15,0.82)_100%)]" />
        </div>

        {/* Content container fills remaining space and overlays image */}
        <div className="relative flex flex-col justify-between flex-1 z-10">
          <div className="left-4 top-4 right-4 sm:left-6 sm:right-auto sm:top-6 absolute">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-surface-container-lowest/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container backdrop-blur-md">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
              >
                verified
              </span>
              <span>Verified Collection</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="rounded-[1.75rem] bg-surface-container-lowest/88 p-4 text-primary-container backdrop-blur-xl sm:p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                    {activeSlide.location}
                  </p>
                  <h3 className="font-headline text-3xl font-black tracking-[-0.04em]">
                    {activeSlide.title}
                  </h3>
                  <p className="text-sm font-semibold text-on-tertiary-container">
                    {activeSlide.price}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="flex items-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`motion-indicator h-2.5 rounded-full ${
                          index === activeIndex
                            ? "w-8 bg-primary-container"
                            : "w-2.5 bg-outline-variant"
                        }`}
                        aria-label={`Show slide ${index + 1}`}
                        aria-pressed={index === activeIndex}
                      />
                    ))}
                  </div>
                  <Link
                    href="/search"
                    className="group motion-card-subtle motion-icon-group inline-flex h-[68px] w-full shrink-0 items-center justify-between rounded-[1.25rem] px-3 py-2 text-primary-container sm:h-[72px] sm:w-[220px]"
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                        Curated next
                      </span>
                      <span className="mt-1 block font-headline text-sm font-black uppercase tracking-[0.16em]">
                        Explore Homes
                      </span>
                      <span className="mt-2 block h-0.5 w-20 bg-tertiary-fixed-dim" />
                    </div>
                    <span className="motion-icon flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container-lowest text-primary-container shadow-[var(--shadow-editorial-card)]">
                      <span className="material-symbols-outlined text-[18px]">
                        north_east
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
