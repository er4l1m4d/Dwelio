import SearchGridSkeleton from "@/components/skeletons/SearchGridSkeleton";

export default function LoadingSearch() {
  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <SearchGridSkeleton />
      </div>
    </div>
  );
}
