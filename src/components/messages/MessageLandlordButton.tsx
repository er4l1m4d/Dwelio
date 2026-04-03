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
        className="inline-flex h-14 items-center justify-center rounded-[1rem] bg-primary-container px-5 font-headline text-sm font-black uppercase tracking-[0.14em] text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Opening..." : "Message Landlord"}
      </button>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
