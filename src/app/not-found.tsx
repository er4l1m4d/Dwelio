import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-10 text-center shadow-[0_30px_70px_rgba(16,42,24,0.08)]">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-600">
          That page doesn’t exist. Let’s get you back to listings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-200 px-6 text-sm font-semibold text-emerald-800"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  );
}
