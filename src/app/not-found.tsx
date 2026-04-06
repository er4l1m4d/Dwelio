import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-container-highest via-surface to-secondary-fixed px-6 py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border border-outline-variant bg-surface-container-lowest/90 p-10 text-center shadow-[var(--shadow-elevated-panel)]">
        <h1 className="font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">Page not found</h1>
        <p className="text-sm text-on-surface-variant">
          That page doesnt exist. Lets get you back to listings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary-container px-6 text-sm font-bold text-on-primary transition hover:bg-primary"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center rounded-full border border-outline-variant px-6 text-sm font-bold text-primary-container transition hover:bg-surface-container-low"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  );
}
