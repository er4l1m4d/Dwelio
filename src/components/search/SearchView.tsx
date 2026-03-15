"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import SearchResults from "@/components/search/SearchResults";
import SearchSidebar from "@/components/search/SearchSidebar";
import SearchMapView from "@/components/search/SearchMapView";

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
  property_type?: string | null;
  landlord_id: string;
};

type SearchViewProps = {
  listings: Listing[];
  verifiedMap: Map<string, boolean | null | undefined>;
  neighbourhoods: string[];
};

export default function SearchView({
  listings,
  verifiedMap,
  neighbourhoods,
}: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState(searchParams.get("view") ?? "list");

  useEffect(() => {
    setView(searchParams.get("view") ?? "list");
  }, [searchParams]);

  const updateView = (nextView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <SearchSidebar neighbourhoods={neighbourhoods} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateView("list")}
            disabled={pending}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              view === "list"
                ? "bg-emerald-700 text-white"
                : "border border-emerald-200 text-emerald-800"
            }`}
          >
            List view
          </button>
          <button
            type="button"
            onClick={() => updateView("map")}
            disabled={pending}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              view === "map"
                ? "bg-emerald-700 text-white"
                : "border border-emerald-200 text-emerald-800"
            }`}
          >
            Map view
          </button>
        </div>

        {view === "map" ? (
          <SearchMapView listings={listings} />
        ) : (
          <SearchResults listings={listings} verifiedMap={verifiedMap} />
        )}
      </div>
    </div>
  );
}
