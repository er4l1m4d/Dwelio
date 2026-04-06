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
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
              Welcome back, {profile?.full_name ?? "Dwelio member"}
            </h1>
            <p className="text-base text-on-surface-variant">
              Manage your listings and stay on top of inquiries.
            </p>
          </div>
          {isLandlord && (
            <Link
              href="/listings/new"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary"
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
            <h2 className="font-headline text-lg font-black tracking-[-0.02em] text-primary-container">
              Your listings
            </h2>
            <div className="grid gap-4">
              {listings && listings.length > 0 ? (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex flex-col gap-4 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[var(--shadow-elevated-panel)] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 overflow-hidden rounded-[1.5rem] bg-surface-container-low">
                        <Image
                          src={listing.images?.[0] ?? "/vercel.svg"}
                          alt={listing.title}
                          width={80}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-headline text-sm font-bold text-primary-container">
                          {listing.title}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          ₦{listing.price?.toLocaleString()} / {listing.price_period}
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
                <p className="text-on-surface-variant">No listings yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
