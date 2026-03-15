"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function UnreadBadge() {
  const supabase = createSupabaseBrowserClient();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);

      if (mounted) {
        setCount(data?.length ?? 0);
      }
    };

    loadCount();

    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => loadCount(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!count) return null;

  return (
    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-semibold text-white">
      {count}
    </span>
  );
}
