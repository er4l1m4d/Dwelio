import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfilePageProps = {
  params: { id: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, is_verified")
    .eq("id", params.id)
    .single();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, reviewer_id")
    .eq("reviewed_id", params.id)
    .order("created_at", { ascending: false });

  const { data: listings } = await supabase
    .from("properties")
    .select("id, title, price, price_period, images")
    .eq("landlord_id", params.id)
    .limit(6);

  if (!profile) {
    return (
      <div className="min-h-screen px-6 py-16">
        <p className="text-slate-600">Profile not found.</p>
      </div>
    );
  }

  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
          reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50">
                <Image
                  src={profile.avatar_url ?? "/vercel.svg"}
                  alt={profile.full_name ?? "Profile"}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {profile.full_name ?? "Dwelio user"}
                </h1>
                <p className="text-sm text-slate-500">
                  {profile.role?.toUpperCase() ?? "USER"} · Rating: {averageRating}
                </p>
              </div>
            </div>
            {profile.is_verified && (
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Verified Landlord
              </span>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
            <div className="mt-4 grid gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900"
                  >
                    <p className="font-semibold">
                      {review.rating ?? 0}★ rating
                    </p>
                    <p className="mt-2 text-emerald-900/80">
                      {review.comment ?? "No comment provided."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">
              Active listings
            </h2>
            <div className="mt-4 grid gap-4">
              {listings && listings.length > 0 ? (
                listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-700 transition hover:border-emerald-300"
                  >
                    <p className="font-semibold text-slate-900">
                      {listing.title}
                    </p>
                    <p className="mt-1 text-slate-500">
                      ₦{listing.price?.toLocaleString()} / {listing.price_period}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">No listings yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
