import SearchView from "@/components/search/SearchView";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dwelio | Search Listings",
  description:
    "Browse verified listings in Ibadan with filters for price, bedrooms, and neighbourhood.",
};

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
      "id, title, price, price_period, neighbourhood, bedrooms, bathrooms, images, type, property_type, landlord_id",
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

        <SearchView
          listings={listings ?? []}
          verifiedMap={verifiedMap}
          neighbourhoods={neighbourhoods}
        />
      </div>
    </div>
  );
}
