import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16 text-slate-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 rounded-3xl border border-emerald-100 bg-white/85 p-12 shadow-[0_30px_80px_rgba(16,42,24,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Dwelio
            <span className="text-emerald-400">•</span>
            Ibadan launch
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Find your next home in Ibadan, without the wahala.
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Verified landlords, monthly payments, and digital tenancy agreements
            built for Nigeria.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
          >
            Log in
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            "Verified listings with trusted landlords",
            "Monthly rent payments with escrow protection",
            "Digital tenancy agreements and receipts",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900"
            >
              {item}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
