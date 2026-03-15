"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";

type Listing = {
  id: string;
  title: string;
  price: number | null;
  price_period?: string | null;
  neighbourhood?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  images?: string[] | null;
  type?: string | null;
  landlord_id: string;
};

type SearchResultsProps = {
  listings: Listing[];
  verifiedMap: Map<string, boolean | null | undefined>;
};

export default function SearchResults({ listings, verifiedMap }: SearchResultsProps) {
  const searchParams = useSearchParams();

  const filteredListings = useMemo(() => {
    const type = searchParams.get("type");
    const propertyType = searchParams.get("propertyType");
    const neighbourhood = searchParams.get("neighbourhood");
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 0);
    const bedrooms = Number(searchParams.get("bedrooms") ?? 0);

    return listings.filter((listing) => {
      if (type && listing.type !== type) return false;
      if (propertyType && listing.type !== propertyType && listing.type) return false;
      if (neighbourhood && listing.neighbourhood !== neighbourhood) return false;
      if (minPrice && (listing.price ?? 0) < minPrice) return false;
      if (maxPrice && (listing.price ?? 0) > maxPrice) return false;
      if (bedrooms && (listing.bedrooms ?? 0) < bedrooms) return false;
      return true;
    });
  }, [listings, searchParams]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredListings.length > 0 ? (
        filteredListings.map((listing) => (
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
  );
}
