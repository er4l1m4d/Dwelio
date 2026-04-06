"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import type { SearchListing } from "@/components/search/SearchView";

type SearchMapViewProps = {
  listings: SearchListing[];
};

const ibadanCenter = { lat: 7.3775, lng: 3.947 };

const containerStyle = {
  width: "100%",
  height: "clamp(420px, 70vh, 640px)",
};

const getOffset = (value: string, divisor: number) => {
  const seed = parseInt(value.replace(/-/g, "").slice(0, 8), 16);
  return ((seed % 1000) - 500) / divisor;
};

const formatCompactPrice = (price: number | null) =>
  `₦${new Intl.NumberFormat("en-NG", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(price ?? 0)}`;

const NAIRA_SYMBOL = "\u20A6";

const buildMarkerSvg = (priceLabel: string, active: boolean) => {
  const fill = active ? "#013220" : "#ffffff";
  const stroke = active ? "#013220" : "rgba(1, 50, 32, 0.18)";
  const textColor = active ? "#ffffff" : "#013220";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="108" height="52" viewBox="0 0 108 52">
      <rect x="4" y="4" width="100" height="34" rx="17" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <path d="M54 48 L46 36 H62 Z" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>
      <text x="54" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${textColor}">${priceLabel}</text>
    </svg>
  `.trim();
};

export default function SearchMapView({ listings }: SearchMapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
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

  const selectedListing =
    markers.find((listing) => listing.id === selectedId) ?? markers[0] ?? null;

  const formatPriceLabel = (price: number | null) =>
    `${NAIRA_SYMBOL}${new Intl.NumberFormat("en-NG", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(price ?? 0)}`;

  if (!listings.length) {
    return (
      <section className="w-full max-w-full box-border rounded-[2rem] bg-surface-container-low p-10 shadow-[var(--shadow-editorial-card)]">
        <h2 className="w-full max-w-full font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
          No map results yet.
        </h2>
        <p className="mt-4 w-full max-w-full text-base leading-8 text-on-surface-variant">
          Adjust your filters to bring more homes into view across the Ibadan
          map.
        </p>
      </section>
    );
  }

  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
    return (
      <section className="w-full max-w-full box-border rounded-[2rem] bg-surface-container-low p-10 shadow-[var(--shadow-editorial-card)]">
        <h2 className="w-full max-w-full font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
          Live map unavailable.
        </h2>
        <p className="mt-4 w-full max-w-full text-base leading-8 text-on-surface-variant">
          Add a valid Google Maps key to enable the full discovery map. Your
          filtered homes are still available in list view.
        </p>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className="w-full max-w-full box-border rounded-[2rem] bg-surface-container-low p-10 shadow-[var(--shadow-editorial-card)]">
        <h2 className="w-full max-w-full font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
          Loading the Ibadan map...
        </h2>
        <p className="mt-4 w-full max-w-full text-base leading-8 text-on-surface-variant">
          Pulling live map data and placing your filtered homes.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden w-full max-w-full box-border rounded-[2rem] bg-surface-container-lowest shadow-[var(--shadow-elevated-panel)]">
      <div className="absolute left-4 top-4 z-10 rounded-full bg-surface-container-lowest/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-container shadow-[var(--shadow-floating-pane)] backdrop-blur-md sm:left-6 sm:top-6">
        Ibadan Live Map
      </div>
      <div className="absolute left-4 top-16 z-10 rounded-full bg-surface-container-lowest/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-container shadow-[var(--shadow-floating-pane)] backdrop-blur-md sm:left-auto sm:right-6 sm:top-6">
        {listings.length} Homes
      </div>

      <GoogleMap
        zoom={12}
        center={selectedListing?.position ?? ibadanCenter}
        mapContainerStyle={containerStyle}
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: true,
        }}
      >
        {markers.map((listing) => {
          const active = listing.id === selectedListing?.id;
          const iconSvg = buildMarkerSvg(formatPriceLabel(listing.price), active);

          return (
            <MarkerF
              key={listing.id}
              position={listing.position}
              onClick={() => setSelectedId(listing.id)}
              zIndex={active ? 10 : 1}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
                scaledSize: new window.google.maps.Size(108, 52),
                anchor: new window.google.maps.Point(54, 52),
              }}
            />
          );
        })}
      </GoogleMap>

      {selectedListing && (
        <div className="absolute bottom-6 left-4 right-4 z-10 md:left-6 md:right-auto md:w-[360px]">
          <div className="rounded-[1.75rem] bg-surface-container-lowest/94 p-5 text-primary-container shadow-[var(--shadow-elevated-panel)] backdrop-blur-xl w-full">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              {selectedListing.neighbourhood ?? "Ibadan"}
            </p>
            <h3 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em]">
              {selectedListing.title}
            </h3>
            <p className="mt-3 text-sm font-semibold text-on-tertiary-container">
              {formatPriceLabel(selectedListing.price)} /{" "}
              {selectedListing.price_period ?? "monthly"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-on-surface-variant">
              <span>{selectedListing.bedrooms ?? 0} beds</span>
              <span>{selectedListing.bathrooms ?? 0} baths</span>
              {selectedListing.property_type && (
                <span>{selectedListing.property_type}</span>
              )}
            </div>
            <Link
              href={`/listings/${selectedListing.id}`}
              className="group motion-card-subtle motion-icon-group mt-5 inline-flex items-center gap-3 rounded-full bg-primary-container px-5 py-3 font-headline text-xs font-black uppercase tracking-[0.14em] text-on-primary"
            >
              View Home
              <span className="motion-icon material-symbols-outlined text-[18px]">
                north_east
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
