import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-emerald-900 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold">Dwelio</h2>
          <p className="mt-2 text-sm text-emerald-100">
            Find your next home in Ibadan with trusted landlords and monthly rent.
          </p>
          <p className="mt-4 text-xs text-emerald-200">Find it. Trust it. Move in.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-emerald-100">About</p>
          <Link href="/" className="text-emerald-200 hover:text-white">
            About Us
          </Link>
          <Link href="/page" className="text-emerald-200 hover:text-white">
            How It Works
          </Link>
          <Link href="/blog" className="text-emerald-200 hover:text-white">
            Blog
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-emerald-100">Explore</p>
          <Link href="/search" className="text-emerald-200 hover:text-white">
            Browse Listings
          </Link>
          <Link href="/neighbourhoods" className="text-emerald-200 hover:text-white">
            Neighbourhoods
          </Link>
          <Link href="/listings/new" className="text-emerald-200 hover:text-white">
            Sell a Property
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-emerald-100">Support</p>
          <Link href="/help" className="text-emerald-200 hover:text-white">
            Help Centre
          </Link>
          <Link href="/contact" className="text-emerald-200 hover:text-white">
            Contact Us
          </Link>
          <Link href="/report" className="text-emerald-200 hover:text-white">
            Report a Listing
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-emerald-100">Legal</p>
          <Link href="/privacy" className="text-emerald-200 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-emerald-200 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
