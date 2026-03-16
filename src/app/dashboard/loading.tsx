import SearchGridSkeleton from "@/components/skeletons/SearchGridSkeleton";

export default function LoadingDashboard() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SearchGridSkeleton />
      </div>
    </div>
  );
}
