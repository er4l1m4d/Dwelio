import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReviewsListProps = {
  userId: string;
};

export default async function ReviewsList({ userId }: ReviewsListProps) {
  const supabase = await createSupabaseServerClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, reviewer_id")
    .eq("reviewed_id", userId)
    .order("created_at", { ascending: false });

  const reviewerIds = reviews?.map((review) => review.reviewer_id) ?? [];
  const { data: reviewers } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", reviewerIds);

  const reviewerMap = new Map(
    reviewers?.map((reviewer) => [reviewer.id, reviewer]) ?? [],
  );

  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
          reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
        Average rating: <span className="font-semibold">{averageRating}</span>
      </div>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          const reviewer = reviewerMap.get(review.reviewer_id);
          return (
            <div
              key={review.id}
              className="rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-slate-700 shadow-[0_12px_30px_rgba(16,42,24,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {reviewer?.full_name ?? "Dwelio user"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {review.rating ?? 0}★
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {review.comment ?? "No comment provided."}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-slate-500">No reviews yet.</p>
      )}
    </div>
  );
}
