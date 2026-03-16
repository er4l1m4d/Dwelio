"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-10 text-center shadow-[0_30px_70px_rgba(16,42,24,0.08)]">
        <h1 className="text-3xl font-semibold text-slate-900">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-600">
          Please try again. If this keeps happening, we’ll fix it quickly.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
