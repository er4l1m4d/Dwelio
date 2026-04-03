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
    <div className="overflow-hidden rounded-[2.25rem] bg-white/10 shadow-[var(--shadow-elevated-panel)] backdrop-blur-md">
      <div className="relative min-h-[420px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,27,15,0.08)_0%,rgba(0,27,15,0.22)_35%,rgba(0,27,15,0.82)_100%)]" />
          </div>
        ))}

        <div className="absolute left-6 top-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container backdrop-blur-md">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
            >
              verified
            </span>
            <span>Verified Collection</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="rounded-[1.75rem] bg-surface-container-lowest/88 p-5 text-primary-container backdrop-blur-xl">
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

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeIndex
                          ? "w-8 bg-primary-container"
                          : "w-2.5 bg-outline-variant"
                      }`}
                      aria-label={`Show slide ${index + 1}`}
                    />
                  ))}
                </div>
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center rounded-[1rem] bg-primary-container px-5 font-headline text-sm font-bold uppercase tracking-[0.12em] text-on-primary transition hover:bg-primary"
                >
                  Explore Homes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
