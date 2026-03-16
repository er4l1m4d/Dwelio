import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";

export const metadata = {
  title: "Dwelio | Find Your Home in Ibadan",
  description:
    "Verified landlords, monthly payments, and digital tenancy agreements for Ibadan renters.",
};

const stats = [
  { label: "Listings", value: "1,200+" },
  { label: "Verified landlords", value: "340+" },
  { label: "Happy tenants", value: "900+" },
];

const howItWorks = [
  {
    title: "Search",
    copy: "Browse verified listings across Ibadan in minutes.",
  },
  {
    title: "Verify",
    copy: "Landlords are ID-checked and listings are traceable.",
  },
  {
    title: "Move In",
    copy: "Pay monthly, sign digitally, and move in with confidence.",
  },
];

const whyDwelio = [
  {
    title: "No Agent Fees",
    copy: "Connect directly to landlords and avoid surprise charges.",
  },
  {
    title: "Verified Landlords",
    copy: "ID checks and reviews build trust before you visit.",
  },
  {
    title: "Monthly Payments",
    copy: "Break rent into monthly instalments with escrow protection.",
  },
  {
    title: "Virtual Tours",
    copy: "Preview homes with photos and walkthrough videos.",
  },
];

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: listings } = await supabase
    .from("properties")
    .select(
      "id, title, price, price_period, neighbourhood, bedrooms, bathrooms, images, type, landlord_id",
    )
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: landlords } = await supabase
    .from("profiles")
    .select("id, is_verified")
    .in(
      "id",
      listings?.map((listing) => listing.landlord_id) ?? [],
    );

  const verifiedMap = new Map(
    landlords?.map((landlord) => [landlord.id, landlord.is_verified]) ?? [],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f3e8,_#ffffff_40%,_#e9f6ef)] text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Dwelio
              <span className="text-emerald-400">•</span>
              Ibadan launch
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Find your home in Ibadan, without the wahala.
            </h1>
            <p className="max-w-xl text-base text-slate-600">
              Verified landlords, monthly payments, and digital tenancy
              agreements — all built for Nigeria.
            </p>
            <div className="grid gap-3 rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur sm:grid-cols-[1fr_1fr_auto]">
              <input
                placeholder="Ibadan, Oyo"
                className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none"
              />
              <select className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none">
                <option>Property type</option>
                <option>Flat</option>
                <option>House</option>
                <option>Room</option>
                <option>Duplex</option>
              </select>
              <Link
                href="/search"
                className="flex h-12 items-center justify-center rounded-2xl bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Browse listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Browse listings
              </Link>
              <Link
                href="/listings/new"
                className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
              >
                List your property
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="relative rounded-[32px] border border-emerald-100 bg-white/90 p-6 shadow-[0_30px_70px_rgba(16,42,24,0.12)] backdrop-blur">
              <p className="text-sm font-semibold text-emerald-700">
                Dwelio trust layer
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                No agent fees. No fake listings. No stress.
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Every listing is verified and every payment is traceable. You
                see the landlord, the reviews, and the agreement before you pay.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "ID-verified landlords",
                  "Monthly rent payments",
                  "Digitally signed agreements",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <div
                key={item.title}
                className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  Step {index + 1}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Featured listings
            </h2>
            <Link
              href="/search"
              className="text-sm font-semibold text-emerald-800"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings && listings.length > 0 ? (
              listings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  id={listing.id}
                  image={listing.images?.[0]}
                  title={listing.title}
                  price={listing.price ?? 0}
                  pricePeriod={listing.price_period}
                  neighbourhood={listing.neighbourhood}
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  listingType={listing.type}
                  isVerified={verifiedMap.get(listing.landlord_id) ?? false}
                />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-emerald-100 bg-white/90 p-8 text-sm text-slate-600 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
                No listings yet. Add your first property to get featured here.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-2xl font-semibold text-slate-900">Why Dwelio</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {whyDwelio.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-900 px-8 py-10 text-white shadow-[0_30px_70px_rgba(16,42,24,0.18)]">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="text-sm text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Ready to find your next home?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Dwelio makes renting feel safe, digital, and fair.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Create account
            </Link>
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
            >
              Explore listings
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
