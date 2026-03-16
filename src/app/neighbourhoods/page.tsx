import Link from "next/link";
import { ibadanNeighbourhoods } from "@/data/ibadan-neighbourhoods";

export default function NeighbourhoodsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">
            Ibadan neighbourhood insights
          </h1>
          <p className="text-base text-slate-600">
            Compare rent ranges, vibe, and landmarks before you choose.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {ibadanNeighbourhoods.map((neighbourhood) => (
            <div
              key={neighbourhood.name}
              className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {neighbourhood.name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {neighbourhood.vibe}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {neighbourhood.description}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>1-bed: {neighbourhood.rent.oneBed}</p>
                <p>2-bed: {neighbourhood.rent.twoBed}</p>
                <p>3-bed: {neighbourhood.rent.threeBed}</p>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Landmarks: {neighbourhood.landmarks.join(", ")}
              </p>
              <Link
                href={`/search?neighbourhood=${encodeURIComponent(
                  neighbourhood.name,
                )}`}
                className="mt-5 inline-flex text-sm font-semibold text-emerald-800"
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
