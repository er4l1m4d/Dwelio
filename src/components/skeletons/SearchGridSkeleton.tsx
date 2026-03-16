import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

export default function SearchGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
