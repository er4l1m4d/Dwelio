import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import RecommendationsPanel from "@/components/recommendations/RecommendationsPanel";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-16">
        <p className="text-slate-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const { data: listings } = await supabase
    .from("properties")
    .select("id, title, price, price_period, images, is_available, views")
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false });

  const { data: availableListings } = await supabase
    .from("properties")
    .select(
      "id, title, price, price_period, neighbourhood, bedrooms, bathrooms, images, type",
    )
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const isLandlord = profile?.role === "landlord";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome back, {profile?.full_name ?? "Dwelio member"}
            </h1>
            <p className="text-base text-slate-600">
              Manage your listings and stay on top of inquiries.
            </p>
          </div>
          {isLandlord && (
            <Link
              href="/listings/new"
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Add new listing
            </Link>
          )}
        </header>

        {!isLandlord && (
          <RecommendationsPanel listings={availableListings ?? []} />
        )}

        {isLandlord && (
          <section className="grid gap-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Your listings
            </h2>
            <div className="grid gap-4">
              {listings && listings.length > 0 ? (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
                        <Image
                          src={listing.images?.[0] ?? "/vercel.svg"}
                          alt={listing.title}
                          width={80}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {listing.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          ₦{listing.price?.toLocaleString()} /{" "}
                          {listing.price_period}
                        </p>
                        <p className="text-xs text-slate-500">
                          Views: {listing.views ?? 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {listing.is_available ? "Available" : "Rented"}
                      </span>
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300"
                      >
                        Mark as rented
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-sm text-slate-600 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
                  <Home className="h-6 w-6 text-emerald-700" />
                  <p className="mt-2 font-semibold text-slate-900">
                    No listings yet
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Create your first property to start receiving inquiries.
                  </p>
                  <Link
                    href="/listings/new"
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-emerald-200 px-4 text-xs font-semibold text-emerald-800"
                  >
                    Add a listing
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
