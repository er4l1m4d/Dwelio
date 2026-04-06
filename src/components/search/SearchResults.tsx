"use client";

import PropertyCard from "@/components/PropertyCard";
import type { SearchListing } from "@/components/search/SearchView";

type SearchResultsProps = {
  listings: SearchListing[];
  verifiedMap: Map<string, boolean | null | undefined>;
};

export default function SearchResults({
  listings,
  verifiedMap,
}: SearchResultsProps) {
  if (!listings.length) {
    return (
      <section className="rounded-[2rem] bg-surface-container-low p-10 shadow-[var(--shadow-editorial-card)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)]">
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
          >
            search_off
          </span>
        </div>
        <h2 className="mt-6 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
          No homes match this search yet.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-8 text-on-surface-variant">
          Try opening up the neighbourhood, budget, or bedroom filters. Ibadan
          inventory can change quickly as landlords list and unlist homes.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
      {listings.map((listing) => (
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
          propertyType={listing.property_type}
          isVerified={verifiedMap.get(listing.landlord_id) ?? false}
        />
      ))}
    </section>
  );
}
