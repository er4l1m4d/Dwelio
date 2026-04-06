import Image from "next/image";
import Link from "next/link";

type PropertyCardProps = {
  id: string;
  image?: string | null;
  title: string;
  price: number;
  pricePeriod?: string | null;
  neighbourhood?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  isVerified?: boolean | null;
  listingType?: string | null;
  propertyType?: string | null;
};

const formatCompactPrice = (price: number) =>
  `₦${new Intl.NumberFormat("en-NG", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(price)}`;

const NAIRA_SYMBOL = "\u20A6";

export default function PropertyCard({
  id,
  image,
  title,
  price,
  pricePeriod,
  neighbourhood,
  bedrooms,
  bathrooms,
  isVerified,
  listingType,
  propertyType,
}: PropertyCardProps) {
  const formattedPrice = `${NAIRA_SYMBOL}${new Intl.NumberFormat("en-NG", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(price)}`;

  return (
    <Link
      href={`/listings/${id}`}
      className="group motion-card motion-image-frame flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[var(--shadow-elevated-panel)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
        <Image
          src={image ?? "/vercel.svg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
          className="motion-image object-cover"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {listingType && (
            <span className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary">
              {listingType}
            </span>
          )}
          {isVerified && (
            <span className="rounded-full bg-tertiary-fixed-dim px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-tertiary-fixed">
              Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-bold text-primary-container backdrop-blur-md">
            {neighbourhood ?? "Ibadan"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h3 className="font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Direct discovery with clearer pricing, stronger trust cues, and a
              smoother move-in path.
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="font-headline text-2xl font-black text-on-tertiary-container">
              {formattedPrice}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              / {pricePeriod ?? "monthly"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm font-medium text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              bed
            </span>
            {bedrooms ?? 0} beds
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              bathtub
            </span>
            {bathrooms ?? 0} baths
          </span>
          {propertyType && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2">
              <span className="material-symbols-outlined text-[18px] text-primary-container">
                home_work
              </span>
              {propertyType}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
