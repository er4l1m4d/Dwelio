"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type MessageLandlordButtonProps = {
  landlordId: string;
  propertyId: string;
};

export default function MessageLandlordButton({
  landlordId,
  propertyId,
}: MessageLandlordButtonProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const conversationId = `${landlordId}-${propertyId}`;

      router.push(`/messages/${conversationId}`);
    });
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={handleClick}
        className="h-12 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Opening..." : "Message Landlord"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
