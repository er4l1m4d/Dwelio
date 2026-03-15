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
};

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
}: PropertyCardProps) {
  return (
    <Link
      href={`/listings/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(16,42,24,0.08)] transition hover:-translate-y-1 hover:border-emerald-200"
    >
      <div className="relative h-44 w-full overflow-hidden bg-emerald-50">
        <Image
          src={image ?? "/vercel.svg"}
          alt={title}
          fill
          className="object-cover transition group-hover:scale-105"
        />
        {listingType && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            {listingType.toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{neighbourhood}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{bedrooms ?? 0} bed</span>
          <span>{bathrooms ?? 0} bath</span>
          {isVerified && (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
              Verified
            </span>
          )}
        </div>
        <div className="mt-auto text-sm font-semibold text-emerald-800">
          ₦{price.toLocaleString()} / {pricePeriod ?? "monthly"}
        </div>
      </div>
    </Link>
  );
}
