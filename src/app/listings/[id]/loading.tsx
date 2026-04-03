import ListingDetailSkeleton from "@/components/skeletons/ListingDetailSkeleton";

export default function LoadingListing() {
  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <ListingDetailSkeleton />
      </div>
    </div>
  );
}
