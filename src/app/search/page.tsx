import SearchView from "@/components/search/SearchView";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Discovery",
  description:
    "Discover verified homes in Ibadan with filters for neighbourhood, price, and home type.",
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
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <SearchView
          listings={listings ?? []}
          verifiedMap={verifiedMap}
          neighbourhoods={neighbourhoods}
        />
      </div>
    </div>
  );
}
