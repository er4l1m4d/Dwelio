"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerSections = [
  {
    title: "Explore",
    items: [
      { label: "Discover", href: "/search" },
      { label: "Neighbourhoods", href: "/neighbourhoods" },
      { label: "List Property", href: "/listings/new" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Payments", href: "/payments" },
      { label: "Messages", href: "/messages" },
      { label: "Sign In", href: "/login" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/search") {
    return null;
  }

  return (
    <footer className="border-t border-outline-variant/30 bg-surface-container-low">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 text-primary-container">
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
          </div>
          <p className="mt-5 text-base leading-7 text-on-surface-variant">
            Nigeria's trust-first property marketplace for verified homes,
            direct landlord access, and secure digital renting.
          </p>
          <p className="mt-6 font-headline text-sm font-bold uppercase tracking-[0.24em] text-primary-container/60">
            Find it. Trust it. Move in.
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title} className="grid gap-4 text-sm">
            <p className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
              {section.title}
            </p>
            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-on-surface-variant transition hover:text-primary-container"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="grid gap-4 text-sm">
          <p className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
            Support
          </p>
          <a
            href="mailto:hello@dwelio.com"
            className="text-on-surface-variant transition hover:text-primary-container"
          >
            hello@dwelio.com
          </a>
          <a
            href="mailto:support@dwelio.com"
            className="text-on-surface-variant transition hover:text-primary-container"
          >
            support@dwelio.com
          </a>
          <span className="text-on-surface-variant">
            Privacy Policy and Terms coming soon
          </span>
        </div>
      </div>

      <div className="border-t border-outline-variant/30">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-6 py-6 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between md:px-8">
          <p>&copy; 2026 Dwelio. Built for trusted renting in Nigeria.</p>
          <p className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary-container/60">
            Ibadan first. National next.
          </p>
        </div>
      </div>
    </footer>
  );
}
