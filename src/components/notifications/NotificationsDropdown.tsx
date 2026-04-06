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
  const panelId = "notifications-panel";

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
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container-low focus:outline-none focus:ring-4 focus:ring-surface-tint/10"
        aria-label="Notifications"
        aria-controls={panelId}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined text-[22px]">
          notifications
        </span>
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label="Notifications panel"
          className="absolute right-0 mt-3 w-72 rounded-[1.5rem] bg-surface-container-lowest p-4 shadow-[var(--shadow-elevated-panel)] border border-outline-variant z-50"
        >
          <p className="font-headline text-sm font-bold text-primary-container">
            Notifications
          </p>
          <div className="mt-3 grid gap-2">
            {items.length > 0 ? (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link ?? "#"}
                  className="rounded-xl bg-surface-container-low p-3 text-xs leading-relaxed text-on-surface-variant transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                >
                  {item.message}
                </Link>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant">
                No notifications yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
