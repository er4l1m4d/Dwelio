"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UnreadBadge from "@/components/messages/UnreadBadge";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const [isAuthed, setIsAuthed] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (mounted) {
        setIsAuthed(Boolean(user));
        setProfileId(user?.id ?? null);
      }
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        if (mounted) {
          setAvatarUrl(data?.avatar_url ?? null);
        }
      }
    };

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session?.user));
      setProfileId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [profileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-emerald-800">
          Dwelio
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/search" className="hover:text-emerald-800">
            Browse
          </Link>
          <Link href="/neighbourhoods" className="hover:text-emerald-800">
            Neighbourhoods
          </Link>
          <Link href="/page" className="hover:text-emerald-800">
            How it works
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/messages"
            className="flex items-center text-sm font-semibold text-slate-600 hover:text-emerald-800"
          >
            Messages
            <UnreadBadge />
          </Link>
          <NotificationsDropdown />
          {!isAuthed ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-800"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (profileId?.slice(0, 1).toUpperCase() ?? "U")
                )}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-emerald-100 bg-white p-2 text-sm shadow-[0_20px_40px_rgba(16,42,24,0.12)]">
                  {profileId && (
                    <Link
                      href={`/profile/${profileId}`}
                      className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-emerald-50"
                    >
                      Profile
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-emerald-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-emerald-50"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = "/login";
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-emerald-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-emerald-200 px-3 py-2 text-sm text-emerald-800 md:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-emerald-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-600">
            <Link href="/search" className="hover:text-emerald-800">
              Browse
            </Link>
            <Link href="/neighbourhoods" className="hover:text-emerald-800">
              Neighbourhoods
            </Link>
            <Link href="/page" className="hover:text-emerald-800">
              How it works
            </Link>
            <Link href="/messages" className="hover:text-emerald-800">
              Messages
            </Link>
            {!isAuthed ? (
              <>
                <Link href="/login" className="hover:text-emerald-800">
                  Log in
                </Link>
                <Link href="/signup" className="hover:text-emerald-800">
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="text-left hover:text-emerald-800"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
