"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import UnreadBadge from "@/components/messages/UnreadBadge";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const navLinks = [
  {
    href: "/search",
    label: "Discover",
    matches: (pathname: string) =>
      pathname === "/search" || pathname.startsWith("/listings/"),
  },
  {
    href: "/neighbourhoods",
    label: "Neighbourhoods",
    matches: (pathname: string) => pathname.startsWith("/neighbourhoods"),
  },
  {
    href: "/payments",
    label: "Payments",
    matches: (pathname: string) =>
      pathname.startsWith("/payments") || pathname.startsWith("/agreements/"),
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const [isAuthed, setIsAuthed] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
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
          .select("avatar_url, full_name")
          .eq("id", user.id)
          .single();

        if (mounted) {
          setAvatarUrl(data?.avatar_url ?? null);
          setDisplayName(data?.full_name ?? null);
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

  useEffect(() => {
    setOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary-container"
            aria-label="Dwelio home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-tertiary-fixed-dim shadow-[var(--shadow-editorial-card)]">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
              >
                home_work
              </span>
            </span>
            <span className="font-headline text-2xl font-black tracking-[-0.04em]">
              Dwelio
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = link.matches(pathname);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex h-11 items-center border-b-2 font-headline text-base font-bold tracking-tight transition-colors ${
                    active
                      ? "border-tertiary-fixed-dim text-primary-container"
                      : "border-transparent text-on-surface-variant hover:text-primary-container"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthed && (
            <>
              <Link
                href="/messages"
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container-low"
                aria-label="Messages"
              >
                <span className="material-symbols-outlined text-[22px]">
                  chat_bubble
                </span>
                <span className="absolute -right-1 -top-1">
                  <UnreadBadge />
                </span>
              </Link>
              <NotificationsDropdown />
            </>
          )}

          {!isAuthed ? (
            <>
              <Link
                href="/login"
                className="inline-flex h-11 items-center px-4 font-headline text-sm font-bold text-on-surface-variant transition hover:text-primary-container"
              >
                Sign In
              </Link>
              <Link
                href="/listings/new"
                className="inline-flex h-11 items-center rounded-md bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary"
              >
                List Property
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/listings/new"
                className="inline-flex h-11 items-center rounded-md bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary"
              >
                List Property
              </Link>
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-surface-container-lowest text-sm font-bold text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container-low"
                  aria-label="Account menu"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (displayName?.[0]?.toUpperCase() ??
                      profileId?.slice(0, 1).toUpperCase() ??
                      "U")
                  )}
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-[1.5rem] bg-surface-container-lowest p-2 text-sm shadow-[var(--shadow-elevated-panel)]">
                    <Link
                      href="/dashboard"
                      className="block rounded-xl px-4 py-3 text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary-container"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block rounded-xl px-4 py-3 text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary-container"
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                      }}
                      className="mt-1 w-full rounded-xl px-4 py-3 text-left text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary-container"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)] md:hidden"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-outline-variant/30 bg-surface-container-low px-6 py-5 md:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = link.matches(pathname);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl px-4 py-3 font-headline text-base font-bold transition ${
                      active
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-lowest text-primary-container"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/messages"
                className="rounded-2xl bg-surface-container-lowest px-4 py-3 font-headline text-base font-bold text-primary-container"
              >
                Messages
              </Link>
            </div>

            <div className="flex flex-col gap-3 border-t border-outline-variant/30 pt-4">
              {!isAuthed ? (
                <>
                  <Link
                    href="/login"
                    className="rounded-2xl bg-surface-container-lowest px-4 py-3 font-headline text-base font-bold text-primary-container"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-2xl bg-secondary-container px-4 py-3 font-headline text-base font-bold text-primary-container"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/listings/new"
                    className="rounded-2xl bg-primary-container px-4 py-3 font-headline text-base font-bold text-on-primary"
                  >
                    List Property
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-2xl bg-surface-container-lowest px-4 py-3 font-headline text-base font-bold text-primary-container"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="rounded-2xl bg-surface-container-lowest px-4 py-3 font-headline text-base font-bold text-primary-container"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/listings/new"
                    className="rounded-2xl bg-primary-container px-4 py-3 font-headline text-base font-bold text-on-primary"
                  >
                    List Property
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = "/login";
                    }}
                    className="rounded-2xl bg-surface-container-lowest px-4 py-3 text-left font-headline text-base font-bold text-primary-container"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
