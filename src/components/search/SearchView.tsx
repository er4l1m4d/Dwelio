"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import SearchResults from "@/components/search/SearchResults";
import SearchSidebar from "@/components/search/SearchSidebar";
import SearchMapView from "@/components/search/SearchMapView";

export type SearchListing = {
  id: string;
  title: string;
  price: number | null;
  price_period?: string | null;
  neighbourhood?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  images?: string[] | null;
  type?: string | null;
  property_type?: string | null;
  landlord_id: string;
};

export type SearchFilters = {
  type: string;
  propertyType: string;
  neighbourhood: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

const defaultFilters: SearchFilters = {
  type: "",
  propertyType: "",
  neighbourhood: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
};

const NAIRA_SYMBOL = "\u20A6";

type SearchViewProps = {
  listings: SearchListing[];
  verifiedMap: Map<string, boolean | null | undefined>;
  neighbourhoods: string[];
};

const quickFilterDefinitions = [
  {
    label: "All Homes",
    isActive: (filters: SearchFilters) =>
      Object.values(filters).every((value) => value === ""),
    nextFilters: () => defaultFilters,
  },
  {
    label: "Rent",
    isActive: (filters: SearchFilters) => filters.type === "rent",
    nextFilters: (filters: SearchFilters) => ({ ...filters, type: "rent" }),
  },
  {
    label: "Sale",
    isActive: (filters: SearchFilters) => filters.type === "sale",
    nextFilters: (filters: SearchFilters) => ({ ...filters, type: "sale" }),
  },
  {
    label: `Under ${NAIRA_SYMBOL}1.5M`,
    isActive: (filters: SearchFilters) => filters.maxPrice === "1500000",
    nextFilters: (filters: SearchFilters) => ({
      ...filters,
      maxPrice: "1500000",
    }),
  },
  {
    label: "3+ Beds",
    isActive: (filters: SearchFilters) => filters.bedrooms === "3",
    nextFilters: (filters: SearchFilters) => ({ ...filters, bedrooms: "3" }),
  },
  {
    label: "Bodija",
    isActive: (filters: SearchFilters) => filters.neighbourhood === "Bodija",
    nextFilters: (filters: SearchFilters) => ({
      ...filters,
      neighbourhood: "Bodija",
    }),
  },
];

export default function SearchView({
  listings,
  verifiedMap,
  neighbourhoods,
}: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState(searchParams.get("view") ?? "list");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setView(searchParams.get("view") ?? "list");
    setFilters({
      type: searchParams.get("type") ?? "",
      propertyType: searchParams.get("propertyType") ?? "",
      neighbourhood: searchParams.get("neighbourhood") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      bedrooms: searchParams.get("bedrooms") ?? "",
    });
  }, [searchParams]);

  const updateQuery = (
    nextFilters: SearchFilters,
    nextView = view,
  ) => {
    const params = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    if (nextView && nextView !== "list") {
      params.set("view", nextView);
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const updateField =
    (field: keyof SearchFilters) =>
    (value: string) => {
      const nextFilters = { ...filters, [field]: value };
      setFilters(nextFilters);
      updateQuery(nextFilters);
    };

  const resetFilters = () => {
    setFilters(defaultFilters);
    updateQuery(defaultFilters);
  };

  const applyQuickFilter = (
    next:
      | SearchFilters
      | ((currentFilters: SearchFilters) => SearchFilters),
  ) => {
    const nextFilters =
      typeof next === "function" ? next(filters) : next;
    setFilters(nextFilters);
    updateQuery(nextFilters);
  };

  const updateView = (nextView: string) => {
    setView(nextView);
    updateQuery(filters, nextView);
  };

  const filteredListings = useMemo(() => {
    const minPrice = Number(filters.minPrice ?? 0);
    const maxPrice = Number(filters.maxPrice ?? 0);
    const bedrooms = Number(filters.bedrooms ?? 0);

    return listings.filter((listing) => {
      if (filters.type && listing.type !== filters.type) return false;
      if (
        filters.propertyType &&
        listing.property_type !== filters.propertyType
      ) {
        return false;
      }
      if (
        filters.neighbourhood &&
        listing.neighbourhood !== filters.neighbourhood
      ) {
        return false;
      }
      if (minPrice && (listing.price ?? 0) < minPrice) return false;
      if (maxPrice && (listing.price ?? 0) > maxPrice) return false;
      if (bedrooms && (listing.bedrooms ?? 0) < bedrooms) return false;
      return true;
    });
  }, [filters, listings]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] min-w-0">
  <div className="order-2 lg:order-1 hidden lg:block">
        <SearchSidebar
          filters={filters}
          neighbourhoods={neighbourhoods}
          pending={pending}
          onFieldChange={updateField}
          onReset={resetFilters}
        />
      </div>

  <div className="order-1 grid gap-6 lg:order-2 min-w-0">
        <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)] md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                Discovery
              </p>
              <h1 className="mt-4 font-headline text-3xl sm:text-4xl font-black tracking-[-0.04em] text-primary-container md:text-5xl break-words">
                Verified homes across Ibadan, without the old stress.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-on-surface-variant break-words">
                Filter homes by neighbourhood, budget, and property type, then
                switch between editorial cards and the live map without losing
                your search context.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile filters toggle - visible on small screens */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="sm:hidden rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-primary-container shadow-[var(--shadow-floating-pane)]"
                aria-label="Open filters"
              >
                Filters
              </button>

              <div className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant shadow-[var(--shadow-floating-pane)]">
                <span className="font-headline font-black text-primary-container">
                  {filteredListings.length}
                </span>{" "}
                homes
              </div>
              <div className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant shadow-[var(--shadow-floating-pane)]">
                <span className="font-headline font-black text-primary-container">
                  {activeFilterCount}
                </span>{" "}
                active filters
              </div>
              <div className="inline-flex w-full rounded-full bg-surface-container-lowest p-1 shadow-[var(--shadow-floating-pane)] sm:w-auto">
                <button
                  type="button"
                  onClick={() => updateView("list")}
                  disabled={pending}
                  aria-pressed={view === "list"}
                  aria-label="Show results in list view"
                  className={`inline-flex h-10 flex-1 items-center justify-center rounded-full px-4 font-headline text-sm font-bold transition sm:flex-none ${
                    view === "list"
                      ? "bg-primary-container text-on-primary"
                      : "text-on-surface-variant hover:text-primary-container"
                  }`}
                >
                  List View
                </button>
                <button
                  type="button"
                  onClick={() => updateView("map")}
                  disabled={pending}
                  aria-pressed={view === "map"}
                  aria-label="Show results on the map"
                  className={`inline-flex h-10 flex-1 items-center justify-center rounded-full px-4 font-headline text-sm font-bold transition sm:flex-none ${
                    view === "map"
                      ? "bg-primary-container text-on-primary"
                      : "text-on-surface-variant hover:text-primary-container"
                  }`}
                >
                  Map View
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {quickFilterDefinitions.map((chip) => {
              const active = chip.isActive(filters);

              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => applyQuickFilter(chip.nextFilters(filters))}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-primary-container text-on-primary"
                      : "bg-secondary-fixed text-primary-container hover:bg-secondary-container"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        {view === "map" ? (
          <SearchMapView listings={filteredListings} />
        ) : (
          <SearchResults
            listings={filteredListings}
            verifiedMap={verifiedMap}
          />
        )}
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-t-2xl bg-surface p-6 shadow-[var(--shadow-elevated-panel)] sm:rounded-2xl sm:mx-auto sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-black">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full bg-surface-container-lowest px-3 py-2 text-sm font-medium text-primary-container"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <SearchSidebar
                filters={filters}
                neighbourhoods={neighbourhoods}
                pending={pending}
                onFieldChange={updateField}
                onReset={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
