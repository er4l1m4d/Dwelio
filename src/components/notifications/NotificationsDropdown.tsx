"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Notification = {
  id: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsDropdown() {
  const supabase = createSupabaseBrowserClient();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("id, message, link, is_read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (mounted) {
        setItems((data ?? []) as Notification[]);
      }
    };

    load();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const markRead = async () => {
      if (!open) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
    };

    markRead();
  }, [open, supabase]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800"
      >
        Notifications
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_20px_40px_rgba(16,42,24,0.12)]">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <div className="mt-3 grid gap-2">
            {items.length > 0 ? (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link ?? "#"}
                  className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-3 text-xs text-slate-700"
                >
                  {item.message}
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-500">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
