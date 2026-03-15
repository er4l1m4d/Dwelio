import { createSupabaseServerClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";

const neighbourhoods = [
  "Bodija",
  "Samonda",
  "Agodi GRA",
  "Mokola",
  "Ring Road",
  "Challenge",
  "Dugbe",
  "Ajibode",
  "Agbowo",
  "UI Campus",
  "Iwo Road",
  "New Bodija",
];

export default async function SearchPage() {
  const supabase = await createSupabaseServerClient();

  const { data: listings } = await supabase
    .from("properties")
    .select(
      "id, title, price, price_period, neighbourhood, bedrooms, bathrooms, images, type, landlord_id",
    )
    .eq("is_available", true)
    .order("created_at", { ascending: false });

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            Search homes in Ibadan
          </h1>
          <p className="text-base text-slate-600">
            Filter by location, price, bedrooms, and property type.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <div className="mt-4 grid gap-4 text-sm text-slate-600">
              <label className="grid gap-2">
                Listing type
                <select className="h-11 rounded-xl border border-slate-200 bg-white px-3">
                  <option value="">All</option>
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </label>
              <label className="grid gap-2">
                Property type
                <select className="h-11 rounded-xl border border-slate-200 bg-white px-3">
                  <option value="">All</option>
                  <option value="flat">Flat</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                  <option value="duplex">Duplex</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </label>
              <label className="grid gap-2">
                Neighbourhood
                <select className="h-11 rounded-xl border border-slate-200 bg-white px-3">
                  <option value="">Any</option>
                  {neighbourhoods.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                Min price
                <input
                  type="number"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3"
                />
              </label>
              <label className="grid gap-2">
                Max price
                <input
                  type="number"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3"
                />
              </label>
              <label className="grid gap-2">
                Bedrooms
                <input
                  type="number"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3"
                />
              </label>
            </div>
          </aside>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                No listings yet. Try adjusting your filters or check back soon.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
