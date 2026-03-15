"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from "@react-google-maps/api";

type Listing = {
  id: string;
  title: string;
  price: number | null;
  price_period?: string | null;
  neighbourhood?: string | null;
  images?: string[] | null;
};

type SearchMapViewProps = {
  listings: Listing[];
};

const ibadanCenter = { lat: 7.3775, lng: 3.947 };

const containerStyle = {
  width: "100%",
  height: "520px",
  borderRadius: "24px",
};

const getOffset = (value: string, divisor: number) => {
  const seed = parseInt(value.replace(/-/g, "").slice(0, 8), 16);
  return ((seed % 1000) - 500) / divisor;
};

export default function SearchMapView({ listings }: SearchMapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  });

  const markers = useMemo(
    () =>
      listings.map((listing) => ({
        ...listing,
        position: {
          lat: ibadanCenter.lat + getOffset(listing.id, 10000),
          lng: ibadanCenter.lng + getOffset(listing.id.slice(4), 12000),
        },
      })),
    [listings],
  );

  if (!isLoaded) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-3xl border border-emerald-100 bg-white/90 text-sm text-slate-600 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={12}
      center={ibadanCenter}
      mapContainerStyle={containerStyle}
      options={{ streetViewControl: false, fullscreenControl: false }}
    >
      {markers.map((listing) => (
        <MarkerF
          key={listing.id}
          position={listing.position}
          onClick={() => setSelectedId(listing.id)}
        />
      ))}

      {markers
        .filter((listing) => listing.id === selectedId)
        .map((listing) => (
          <InfoWindowF
            key={listing.id}
            position={listing.position}
            onCloseClick={() => setSelectedId(null)}
          >
            <div className="grid gap-2 text-sm">
              <div className="font-semibold text-slate-900">{listing.title}</div>
              <div className="text-slate-600">{listing.neighbourhood}</div>
              <div className="text-emerald-800">
                ₦{listing.price?.toLocaleString()} /{" "}
                {listing.price_period ?? "monthly"}
              </div>
              <Link
                href={`/listings/${listing.id}`}
                className="text-emerald-700 underline"
              >
                View
              </Link>
            </div>
          </InfoWindowF>
        ))}
    </GoogleMap>
  );
}
