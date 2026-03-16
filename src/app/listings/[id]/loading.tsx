import ListingDetailSkeleton from "@/components/skeletons/ListingDetailSkeleton";

export default function LoadingListing() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <ListingDetailSkeleton />
      </div>
    </div>
  );
}
