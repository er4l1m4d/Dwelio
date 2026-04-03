"use client";

import type { SearchFilters } from "@/components/search/SearchView";

type SearchSidebarProps = {
  filters: SearchFilters;
  neighbourhoods: string[];
  pending: boolean;
  onFieldChange: (field: keyof SearchFilters) => (value: string) => void;
  onReset: () => void;
};

const bedroomOptions = ["", "1", "2", "3", "4"];
const NAIRA_SYMBOL = "\u20A6";

export default function SearchSidebar({
  filters,
  neighbourhoods,
  pending,
  onFieldChange,
  onReset,
}: SearchSidebarProps) {
  return (
    <aside className="grid gap-5">
      <div className="rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
              Refine Search
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container"
          >
            Clear all
          </button>
        </div>

        <div className="mt-6 grid gap-5 text-sm">
          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Listing Type
            </span>
            <select
              value={filters.type}
              onChange={(event) => onFieldChange("type")(event.target.value)}
              disabled={pending}
              className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            >
              <option value="">All listings</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Property Type
            </span>
            <select
              value={filters.propertyType}
              onChange={(event) =>
                onFieldChange("propertyType")(event.target.value)
              }
              disabled={pending}
              className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            >
              <option value="">All homes</option>
              <option value="flat">Flat</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="duplex">Duplex</option>
              <option value="bungalow">Bungalow</option>
            </select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Neighbourhood
            </span>
            <select
              value={filters.neighbourhood}
              onChange={(event) =>
                onFieldChange("neighbourhood")(event.target.value)
              }
              disabled={pending}
              className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            >
              <option value="">Anywhere in Ibadan</option>
              {neighbourhoods.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid min-w-0 gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Min Price
              </span>
              <input
                value={filters.minPrice}
                onChange={(event) =>
                  onFieldChange("minPrice")(event.target.value)
                }
                disabled={pending}
                type="number"
                placeholder={`${NAIRA_SYMBOL}0`}
                className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Max Price
              </span>
              <input
                value={filters.maxPrice}
                onChange={(event) =>
                  onFieldChange("maxPrice")(event.target.value)
                }
                disabled={pending}
                type="number"
                placeholder={`${NAIRA_SYMBOL}1,500,000`}
                className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
          </div>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Bedrooms
            </span>
            <select
              value={filters.bedrooms}
              onChange={(event) => onFieldChange("bedrooms")(event.target.value)}
              disabled={pending}
              className="h-12 w-full min-w-0 rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            >
              <option value="">Any size</option>
              {bedroomOptions
                .filter((option) => option !== "")
                .map((option) => (
                  <option key={option} value={option}>
                    {option}+ bedrooms
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-[2rem] bg-primary-container p-6 text-on-primary shadow-[var(--shadow-editorial-card)]">
        <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed-dim">
          Trust Check
        </p>
        <h3 className="mt-3 font-headline text-2xl font-black tracking-[-0.03em]">
          Search with more clarity than the usual market run.
        </h3>
        <p className="mt-4 text-sm leading-7 text-primary-fixed">
          Discovery is strongest when the listing, the landlord, and the move-in
          process are all easier to trust.
        </p>
      </div>
    </aside>
  );
}
