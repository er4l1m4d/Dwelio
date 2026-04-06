import Link from "next/link";
import { ibadanNeighbourhoods } from "@/data/ibadan-neighbourhoods";

export default function NeighbourhoodsPage() {
  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header>
          <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
            Ibadan neighbourhood insights
          </h1>
          <p className="text-base text-on-surface-variant">
            Compare rent ranges, vibe, and landmarks before you choose.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {ibadanNeighbourhoods.map((neighbourhood) => (
            <div
              key={neighbourhood.name}
              className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[var(--shadow-elevated-panel)]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-headline text-xl font-bold text-primary-container">
                  {neighbourhood.name}
                </h2>
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-container">
                  {neighbourhood.vibe}
                </span>
              </div>
              <p className="mt-3 text-sm text-on-surface-variant">
                {neighbourhood.description}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-on-surface-variant">
                <p>1-bed: {neighbourhood.rent.oneBed}</p>
                <p>2-bed: {neighbourhood.rent.twoBed}</p>
                <p>3-bed: {neighbourhood.rent.threeBed}</p>
              </div>
              <p className="mt-4 text-xs text-on-surface-variant/70">
                Landmarks: {neighbourhood.landmarks.join(", ")}
              </p>
              <Link
                href={`/search?neighbourhood=${encodeURIComponent(
                  neighbourhood.name,
                )}`}
                className="mt-5 inline-flex font-headline text-sm font-bold text-surface-tint transition hover:text-primary-container"
              >
                Browse listings →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
