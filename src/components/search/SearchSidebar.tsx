"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type SearchSidebarProps = {
  neighbourhoods: string[];
};

export default function SearchSidebar({ neighbourhoods }: SearchSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    type: "",
    propertyType: "",
    neighbourhood: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  useEffect(() => {
    setFilters({
      type: searchParams.get("type") ?? "",
      propertyType: searchParams.get("propertyType") ?? "",
      neighbourhood: searchParams.get("neighbourhood") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      bedrooms: searchParams.get("bedrooms") ?? "",
    });
  }, [searchParams]);

  const updateQuery = (nextFilters: typeof filters) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const view = searchParams.get("view");
    if (view) params.set("view", view);
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const updateField = (field: keyof typeof filters) => (value: string) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    updateQuery(next);
  };

  return (
    <aside className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
      <div className="mt-4 grid gap-4 text-sm text-slate-600">
        <label className="grid gap-2">
          Listing type
          <select
            value={filters.type}
            onChange={(event) => updateField("type")(event.target.value)}
            disabled={pending}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          >
            <option value="">All</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </label>
        <label className="grid gap-2">
          Property type
          <select
            value={filters.propertyType}
            onChange={(event) => updateField("propertyType")(event.target.value)}
            disabled={pending}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          >
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
          <select
            value={filters.neighbourhood}
            onChange={(event) => updateField("neighbourhood")(event.target.value)}
            disabled={pending}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          >
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
            value={filters.minPrice}
            onChange={(event) => updateField("minPrice")(event.target.value)}
            disabled={pending}
            type="number"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          />
        </label>
        <label className="grid gap-2">
          Max price
          <input
            value={filters.maxPrice}
            onChange={(event) => updateField("maxPrice")(event.target.value)}
            disabled={pending}
            type="number"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          />
        </label>
        <label className="grid gap-2">
          Bedrooms
          <input
            value={filters.bedrooms}
            onChange={(event) => updateField("bedrooms")(event.target.value)}
            disabled={pending}
            type="number"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3"
          />
        </label>
      </div>
    </aside>
  );
}
