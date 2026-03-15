"use client";

import { useEffect, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ReviewFormProps = {
  reviewedUserId: string;
  propertyId: string;
};

export default function ReviewForm({ reviewedUserId, propertyId }: ReviewFormProps) {
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCanReview(false);
        return;
      }

      const { data } = await supabase
        .from("tenancy_agreements")
        .select("id")
        .eq("tenant_id", user.id)
        .eq("landlord_id", reviewedUserId)
        .eq("property_id", propertyId)
        .limit(1);

      setCanReview(Boolean(data && data.length > 0));
    };

    checkEligibility();
  }, [propertyId, reviewedUserId, supabase]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to submit a review.");
        return;
      }

      const { error: insertError } = await supabase.from("reviews").insert({
        reviewer_id: user.id,
        reviewed_id: reviewedUserId,
        property_id: propertyId,
        rating,
        comment,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess("Review submitted successfully.");
      setRating(0);
      setComment("");
    });
  };

  if (!canReview) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
        Reviews are available after you have an active tenancy agreement with this
        landlord.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${
              rating >= star ? "text-amber-400" : "text-slate-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        placeholder="Share your experience with this landlord..."
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
      />
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
