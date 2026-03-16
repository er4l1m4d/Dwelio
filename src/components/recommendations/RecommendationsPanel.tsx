"use client";

import { useEffect, useState, useTransition } from "react";
import PropertyCard from "@/components/PropertyCard";

type Listing = {
  id: string;
  title: string;
  price: number;
  price_period?: string | null;
  neighbourhood?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  images?: string[] | null;
  type?: string | null;
};

type Recommendation = {
  id: string;
  reason: string;
};

type RecommendationsPanelProps = {
  listings: Listing[];
};

export default function RecommendationsPanel({ listings }: RecommendationsPanelProps) {
  const [pending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [prefs, setPrefs] = useState({
    budgetMin: "",
    budgetMax: "",
    neighbourhoods: "",
    bedrooms: "",
    propertyType: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("dwelio-preferences");
    if (saved) {
      setPrefs(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = () => {
    const payload = {
      budgetMin: prefs.budgetMin ? Number(prefs.budgetMin) : undefined,
      budgetMax: prefs.budgetMax ? Number(prefs.budgetMax) : undefined,
      neighbourhoods: prefs.neighbourhoods
        ? prefs.neighbourhoods.split(",").map((item) => item.trim())
        : undefined,
      bedrooms: prefs.bedrooms ? Number(prefs.bedrooms) : undefined,
      propertyType: prefs.propertyType || undefined,
    };

    localStorage.setItem("dwelio-preferences", JSON.stringify(prefs));

    startTransition(async () => {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setRecommendations(data.recommendations ?? []);
      setShowForm(false);
    });
  };

  const recommendedListings = recommendations
    .map((rec) => listings.find((listing) => listing.id === rec.id))
    .filter(Boolean) as Listing[];

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Recommended for you
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="text-sm font-semibold text-emerald-800"
        >
          {showForm ? "Close" : "Update preferences"}
        </button>
      </div>

      {showForm && (
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <input
            value={prefs.budgetMin}
            onChange={(event) => setPrefs({ ...prefs, budgetMin: event.target.value })}
            placeholder="Min budget"
            className="h-11 rounded-xl border border-slate-200 px-3"
          />
          <input
            value={prefs.budgetMax}
            onChange={(event) => setPrefs({ ...prefs, budgetMax: event.target.value })}
            placeholder="Max budget"
            className="h-11 rounded-xl border border-slate-200 px-3"
          />
          <input
            value={prefs.neighbourhoods}
            onChange={(event) =>
              setPrefs({ ...prefs, neighbourhoods: event.target.value })
            }
            placeholder="Neighbourhoods (comma separated)"
            className="h-11 rounded-xl border border-slate-200 px-3"
          />
          <input
            value={prefs.bedrooms}
            onChange={(event) => setPrefs({ ...prefs, bedrooms: event.target.value })}
            placeholder="Bedrooms"
            className="h-11 rounded-xl border border-slate-200 px-3"
          />
          <input
            value={prefs.propertyType}
            onChange={(event) =>
              setPrefs({ ...prefs, propertyType: event.target.value })
            }
            placeholder="Property type"
            className="h-11 rounded-xl border border-slate-200 px-3"
          />
          <button
            type="button"
            disabled={pending}
            onClick={handleSubmit}
            className="h-11 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
          >
            {pending ? "Saving..." : "Save preferences"}
          </button>
        </div>
      )}

      {!showForm && recommendations.length === 0 && (
        <div className="mt-4 text-sm text-slate-600">
          Tell us what you’re looking for to see personalized picks.
        </div>
      )}

      {recommendedListings.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              id={listing.id}
              image={listing.images?.[0]}
              title={listing.title}
              price={listing.price}
              pricePeriod={listing.price_period}
              neighbourhood={listing.neighbourhood}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              listingType={listing.type}
            />
          ))}
        </div>
      )}
    </section>
  );
}
