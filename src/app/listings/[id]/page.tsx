import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ImageGallery from "@/components/ImageGallery";
import MessageLandlordButton from "@/components/messages/MessageLandlordButton";

type ListingPageProps = {
  params: { id: string };
};

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const supabase = await createSupabaseServerClient();

  const { data: listing } = await supabase
    .from("properties")
    .select(
      "id, title, description, type, property_type, price, price_period, bedrooms, bathrooms, address, neighbourhood, images, video_url, landlord_id, views",
    )
    .eq("id", params.id)
    .single();

  if (!listing) {
    return (
      <div className="min-h-screen px-6 py-16">
        <p className="text-slate-600">Listing not found.</p>
      </div>
    );
  }

  await supabase
    .from("properties")
    .update({ views: (listing.views ?? 0) + 1 })
    .eq("id", listing.id);

  const { data: landlord } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, is_verified")
    .eq("id", listing.landlord_id)
    .single();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <ImageGallery images={listing.images ?? []} />

        {listing.video_url && (
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-black">
            <video controls className="w-full">
              <source src={listing.video_url} />
            </video>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                {listing.type.toUpperCase()}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {listing.property_type.toUpperCase()}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {listing.title}
            </h1>
            <p className="mt-2 text-base text-slate-600">
              {listing.address}, {listing.neighbourhood}
            </p>
            <p className="mt-4 text-lg font-semibold text-emerald-800">
              ₦{listing.price?.toLocaleString()} / {listing.price_period}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                Bedrooms: {listing.bedrooms ?? 0}
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                Bathrooms: {listing.bathrooms ?? 0}
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-700">{listing.description}</p>
          </section>

          <aside className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Landlord</h2>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50">
                <Image
                  src={landlord?.avatar_url ?? "/vercel.svg"}
                  alt={landlord?.full_name ?? "Landlord"}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {landlord?.full_name ?? "Dwelio landlord"}
                </p>
                {landlord?.is_verified && (
                  <p className="text-xs text-emerald-700">Verified Landlord</p>
                )}
                {landlord?.id && (
                  <Link
                    href={`/profile/${landlord.id}`}
                    className="text-xs font-semibold text-emerald-800"
                  >
                    View profile
                  </Link>
                )}
              </div>
            </div>

            {landlord?.id && (
              <MessageLandlordButton
                landlordId={landlord.id}
                propertyId={listing.id}
              />
            )}
            <button
              type="button"
              className="h-12 rounded-full border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
            >
              Save Property
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
