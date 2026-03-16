"use client";

import Link from "next/link";
import { useState } from "react";
import UnreadBadge from "@/components/messages/UnreadBadge";

export default function NavBar() {
  const [open, setOpen] = useState(false);

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
            <Link href="/login" className="hover:text-emerald-800">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-emerald-800">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
