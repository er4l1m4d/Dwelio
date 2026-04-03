import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ibadanNeighbourhoods } from "@/data/ibadan-neighbourhoods";

export const metadata = {
  title: "Find Homes in Ibadan",
  description:
    "Discover verified homes in Ibadan with direct landlord access, secure payments, and digital tenancy agreements.",
};

const platformStats = [
  { label: "Verified landlords", value: "340+" },
  { label: "Homes discovered monthly", value: "1,200+" },
  { label: "Escrow-first move-ins", value: "900+" },
];

const howItWorks = [
  {
    step: "01",
    title: "Discover verified homes",
    copy: "Search Ibadan listings by neighbourhood, budget, and property type without chasing agents around town.",
    icon: "search_insights",
    tone: "bg-primary-container text-on-primary",
  },
  {
    step: "02",
    title: "Trust what you see",
    copy: "Review landlord verification, listing details, and digital paperwork before you commit a single naira.",
    icon: "verified_user",
    tone: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
  },
  {
    step: "03",
    title: "Secure with escrow",
    copy: "Pay through Dwelio, sign digitally, and move in with a clear paper trail and better protection.",
    icon: "payments",
    tone: "bg-secondary-container text-primary-container",
  },
];

const problemCards = [
  {
    title: "Fake listings",
    copy: "No more driving across town for homes that were never real in the first place.",
    icon: "warning",
    tone: "bg-error-container",
  },
  {
    title: "Agent fees everywhere",
    copy: "We make direct landlord discovery feel normal, not like a privilege you pay extra for.",
    icon: "group_off",
    tone: "bg-surface-container",
  },
  {
    title: "Upfront rent pressure",
    copy: "Monthly payment design gives renters more breathing room than the usual 1 to 2 year demand.",
    icon: "calendar_month",
    tone: "bg-surface-container-high",
  },
  {
    title: "No paper trail",
    copy: "Digital agreements and payment history turn stressful renting into something traceable and fairer.",
    icon: "history_edu",
    tone: "bg-primary-fixed",
  },
];

const whyDwelio = [
  "Verified physical tours and clearer landlord identity",
  "Direct contact without the usual middleman markup",
  "Escrow-backed move-in flow and digital tenancy records",
];

const heroSlides = [
  {
    alt: "Contemporary Nigerian villa with warm lighting, tropical landscaping, and a calm premium residential feel.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-RNP_DSeR7qK-69Lt7KhKRYcT3S3nTv419JbXGVjMy00Ro9HRWS_hozfpVa7LzQKYVjSKkwCZ62JlmrhfdLvccMWiD6d2UQnLsx3Z0jor1eC6quDekHsT9HNFBcYa2trM7aeUWg1-QKqDaTJRvcZ55irtVX9VuSnZGaHY52O1H73GrcFzCo5d5cNRTKa0OtFto2W76oHsBoWS7stzxPhndPOUga_qp_qJIJMKhoy92RBEVFA0CjfR3WQ2v9cCYLIhcySuZXrXs6zp",
    location: "Akobo, Ibadan",
    price: "From ₦4.5M / year",
    title: "The Heritage Estate",
  },
  {
    alt: "Modern terrace home in Samonda with clean lines, layered balconies, and a bright Ibadan morning atmosphere.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5ykNcXqadDOyyAo5V2kPk-5O1gACTifq617zKwQ7949quzMAzy6ORmECcRmhoylPs9xqcvPZwALdpE7I8FoBq5D0I4WMbqXkV4M9FGn8cMl8XV-8oy1vLMhYkkCaltV8MzYoMNM_x0mzy_ZoMPAk4HQpX0G_aPtix0DGFEV4BRUHc5QaUA1yuWiEYCsZ_62xyfnb3gGQMWWF8oO9a5amv6DTeqoMXGynz5YEWIhiXOjRslYk0_tgNQgBlY-BUtKHCI0xHQ-oVFxdf",
    location: "Samonda, Ibadan",
    price: "From ₦2.2M / year",
    title: "Samonda Heights Terrace",
  },
  {
    alt: "Premium duplex with refined architecture and greenery in a secure residential part of Ibadan.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOHecTH1vNeJwg6WJkNy6qI_HUJJ5HAsI-j5lAooLTyXvJbFbEUXRb9bYS4T_nH3wFe3BajgIlSJyFv20iuDqG4d74NaJDLfndZbSmx47FqR6Wfk51-bXINa3RIx2jOXq4pStpqobZVPg4hBj-6ZEkx48t9LSALM3-1pvoLWjI9B5dEB_l4w9HFpd9WULRr6DFBk1xR1-_Lx83NLGnGItL2qDbPRsp-KnGdkBT6XAxJCMzv4nfZtg4MYKKd92l77G8N9WmxlVrIPS_",
    location: "Bodija, Ibadan",
    price: "From ₦4.5M / year",
    title: "Onyx Garden Duplex",
  },
];

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: listings } = await supabase
    .from("properties")
    .select(
      "id, title, price, price_period, neighbourhood, bedrooms, bathrooms, images, type, property_type, landlord_id",
    )
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: landlords } = await supabase
    .from("profiles")
    .select("id, is_verified")
    .in(
      "id",
      listings?.map((listing) => listing.landlord_id) ?? [],
    );

  const verifiedMap = new Map(
    landlords?.map((landlord) => [landlord.id, landlord.is_verified]) ?? [],
  );

  const featuredListings = (listings ?? []).slice(0, 3);
  const featuredNeighbourhoods = ibadanNeighbourhoods.slice(0, 3);

  return (
    <div className="bg-surface text-on-surface">
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary-container),var(--primary)_68%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,191,0,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(189,237,210,0.16),transparent_30%)]" />
          <div className="relative mx-auto grid w-full max-w-[1440px] gap-14 px-6 py-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <div className="flex flex-col gap-8 text-on-primary">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed backdrop-blur-md">
                <span>Nigeria's full-stack property marketplace</span>
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim" />
                <span>Ibadan launch</span>
              </div>

              <div className="max-w-3xl space-y-5">
                <h1 className="font-headline text-5xl font-black leading-[0.92] tracking-[-0.05em] text-on-primary sm:text-6xl lg:text-7xl">
                  Find it.
                  <br />
                  Trust it.
                  <br />
                  Move in.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-primary-fixed">
                  Dwelio helps renters discover verified homes in Ibadan, speak
                  directly to landlords, pay more safely, and keep the entire
                  tenancy process digital from first search to move-in.
                </p>
              </div>

              <form
                action="/search"
                method="get"
                className="grid gap-3 rounded-[2rem] bg-white/12 p-3 shadow-[var(--shadow-elevated-panel)] backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr_auto]"
              >
                <label className="grid gap-2 rounded-[1.25rem] bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container/70">
                    Neighbourhood
                  </span>
                  <select
                    name="neighbourhood"
                    defaultValue=""
                    className="border-none bg-transparent p-0 text-base font-semibold text-primary-container outline-none focus:ring-0"
                  >
                    <option value="">Anywhere in Ibadan</option>
                    {ibadanNeighbourhoods.map((neighbourhood) => (
                      <option key={neighbourhood.name} value={neighbourhood.name}>
                        {neighbourhood.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 rounded-[1.25rem] bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container/70">
                    Listing Type
                  </span>
                  <select
                    name="type"
                    defaultValue="rent"
                    className="border-none bg-transparent p-0 text-base font-semibold text-primary-container outline-none focus:ring-0"
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Buy</option>
                  </select>
                </label>

                <label className="grid gap-2 rounded-[1.25rem] bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container/70">
                    Property Type
                  </span>
                  <select
                    name="propertyType"
                    defaultValue=""
                    className="border-none bg-transparent p-0 text-base font-semibold text-primary-container outline-none focus:ring-0"
                  >
                    <option value="">All homes</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="room">Room</option>
                    <option value="duplex">Duplex</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </label>

                <button
                  type="submit"
                  className="inline-flex h-full min-h-14 items-center justify-center rounded-[1.25rem] bg-tertiary-fixed-dim px-8 font-headline text-base font-black text-on-tertiary-fixed transition hover:brightness-95"
                >
                  Explore Homes
                </button>
              </form>

              <div className="grid gap-3 sm:grid-cols-3">
                {platformStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.5rem] bg-white/8 px-5 py-4 backdrop-blur-sm"
                  >
                    <p className="font-headline text-2xl font-black text-on-primary">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-primary-fixed">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <HeroSlideshow slides={heroSlides} />

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[1.75rem] bg-white/10 p-5 text-on-primary shadow-[var(--shadow-editorial-card)] backdrop-blur-md">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-tertiary-fixed-dim">
                    Trust Layer
                  </p>
                  <h3 className="mt-3 font-headline text-xl font-black tracking-[-0.03em]">
                    Escrow-first move-ins
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-primary-fixed">
                    Better payment clarity, digital agreements, and a stronger
                    record of what was promised before keys change hands.
                  </p>
                </div>
                {featuredNeighbourhoods.slice(0, 2).map((neighbourhood) => (
                  <div
                    key={neighbourhood.name}
                    className="rounded-[1.75rem] bg-surface-container-lowest p-5 text-primary-container shadow-[var(--shadow-editorial-card)]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      {neighbourhood.vibe}
                    </p>
                    <h3 className="mt-3 font-headline text-xl font-black tracking-[-0.03em]">
                      {neighbourhood.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      {neighbourhood.description}
                    </p>
                    <p className="mt-4 text-sm font-bold text-on-tertiary-container">
                      1 bed {neighbourhood.rent.oneBed}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 py-24 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                Curated Collection
              </p>
              <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] text-primary-container md:text-5xl">
                Verified homes in Ibadan worth your shortlist.
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex w-fit items-center gap-2 border-b-2 border-tertiary-fixed-dim pb-1 font-headline text-sm font-bold uppercase tracking-[0.16em] text-primary-container transition hover:text-on-tertiary-container"
            >
              View all listings
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredListings.length > 0 ? (
              featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[var(--shadow-elevated-panel)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                    <Image
                      src={listing.images?.[0] ?? "/vercel.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <span className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary">
                        {listing.type ?? "rent"}
                      </span>
                      {verifiedMap.get(listing.landlord_id) && (
                        <span className="rounded-full bg-tertiary-fixed-dim px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-tertiary-fixed">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-bold text-primary-container backdrop-blur-md">
                        {listing.neighbourhood ?? "Ibadan"}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
                          {listing.title}
                        </h3>
                        <p className="mt-2 text-sm text-on-surface-variant">
                          Built for direct discovery, fewer surprises, and a
                          clearer move-in process.
                        </p>
                      </div>
                      <p className="shrink-0 text-right font-headline text-xl font-black text-on-tertiary-container">
                        ₦{listing.price?.toLocaleString() ?? "0"}
                        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                          / {listing.price_period ?? "monthly"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm font-medium text-on-surface-variant">
                      <span>{listing.bedrooms ?? 0} beds</span>
                      <span>{listing.bathrooms ?? 0} baths</span>
                      <span>{listing.property_type ?? "home"}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full rounded-[2rem] bg-surface-container-low p-10 text-on-surface-variant shadow-[var(--shadow-editorial-card)]">
                No listings are live yet. Add your first property to start
                shaping the launch collection.
              </div>
            )}
          </div>
        </section>

        <section className="bg-surface-container-low py-24">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                  How Dwelio Works
                </p>
                <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] text-primary-container md:text-5xl">
                  Built to feel less chaotic than property hunting usually does.
                </h2>
              </div>
              <p className="max-w-lg text-base leading-8 text-on-surface-variant">
                The flow is simple on purpose: discover, verify, then secure the
                home with a clearer digital trail.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div
                  key={item.title}
                  className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-[var(--shadow-editorial-card)]"
                >
                  <p className="absolute right-6 top-5 font-headline text-6xl font-black tracking-[-0.05em] text-surface-container-highest">
                    {item.step}
                  </p>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[1rem] ${item.tone}`}
                  >
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="mt-8 max-w-xs font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-on-surface-variant">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1440px] gap-16 px-6 py-24 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            {problemCards.map((card, index) => (
              <div
                key={card.title}
                className={`rounded-[1.75rem] p-6 shadow-[var(--shadow-editorial-card)] ${
                  index % 2 === 1 ? "translate-y-6" : ""
                } ${card.tone}`}
              >
                <span className="material-symbols-outlined text-[28px] text-primary-container">
                  {card.icon}
                </span>
                <h3 className="mt-5 font-headline text-xl font-black tracking-[-0.03em] text-primary-container">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl space-y-7">
            <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
              Why We Exist
            </p>
            <h2 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container md:text-5xl">
              Property hunting in Nigeria should not feel like a gamble.
            </h2>
            <p className="text-lg leading-8 text-on-surface-variant">
              Dwelio exists to reduce the parts that make renting exhausting:
              fake inventory, hidden fees, fragile paperwork, and a process
              that depends too much on luck and middlemen.
            </p>
            <div className="grid gap-3">
              {whyDwelio.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.25rem] bg-surface-container-low p-4"
                >
                  <span
                    className="material-symbols-outlined mt-0.5 text-on-tertiary-container"
                    style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
                  >
                    check_circle
                  </span>
                  <p className="text-base leading-7 text-primary-container">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 md:px-8">
          <div className="overflow-hidden rounded-[2.5rem] bg-primary-container shadow-[var(--shadow-elevated-panel)]">
            <div className="grid gap-10 px-8 py-14 md:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-16 lg:py-16">
              <div className="max-w-2xl">
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed-dim">
                  Landlords
                </p>
                <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] text-on-primary md:text-5xl">
                  Bring your property to a market built around trust, not noise.
                </h2>
                <p className="mt-5 text-lg leading-8 text-primary-fixed">
                  List for free, attract higher-intent renters, and let Dwelio
                  carry the trust cues, paperwork, and payment structure that
                  make serious tenants more comfortable.
                </p>
              </div>

              <div className="grid gap-4 rounded-[2rem] bg-white/10 p-6 backdrop-blur-md">
                <div className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 text-primary-container">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                    Early mover incentive
                  </p>
                  <p className="mt-2 text-base font-bold">
                    First wave landlords get priority visibility during the
                    Ibadan launch.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/listings/new"
                    className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-tertiary-fixed-dim px-6 font-headline text-sm font-black uppercase tracking-[0.12em] text-on-tertiary-fixed transition hover:brightness-95"
                  >
                    List Property
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-surface-container-lowest px-6 font-headline text-sm font-black uppercase tracking-[0.12em] text-primary-container transition hover:bg-surface-container-low"
                  >
                    Create Account
                  </Link>
                </div>
                <p className="text-sm leading-7 text-primary-fixed">
                  No hidden commissions. More clarity for you and better trust
                  for the tenant from day one.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
