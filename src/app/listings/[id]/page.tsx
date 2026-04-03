import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import ImageGallery from "@/components/ImageGallery";
import MessageLandlordButton from "@/components/messages/MessageLandlordButton";
import { createSupabasePublicClient } from "@/lib/supabase/public";

type ListingPageProps = {
  params: { id: string };
};

const formatMoney = (value: number | null | undefined) =>
  `₦${new Intl.NumberFormat("en-NG").format(value ?? 0)}`;

const NAIRA_SYMBOL = "\u20A6";

const formatMoneyNaira = (value: number | null | undefined) =>
  `${NAIRA_SYMBOL}${new Intl.NumberFormat("en-NG").format(value ?? 0)}`;

const toTitleCase = (value?: string | null) =>
  value
    ? value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "";

const getPeriodLabel = (value?: string | null) => {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized === "yearly" || normalized === "annual" || normalized === "year") {
    return "year";
  }

  if (normalized === "monthly" || normalized === "month") {
    return "month";
  }

  return value ?? "period";
};

const getMonthlyEquivalent = (value: number | null | undefined, period?: string | null) => {
  const normalized = period?.toLowerCase() ?? "";

  if (normalized === "yearly" || normalized === "annual" || normalized === "year") {
    return Math.round((value ?? 0) / 12);
  }

  return value ?? 0;
};

const getListingDetail = cache(async (id: string) => {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("properties")
    .select(
      "id, title, description, type, property_type, price, price_period, bedrooms, bathrooms, address, neighbourhood, images, video_url, landlord_id, views",
    )
    .eq("id", id)
    .single();

  return data;
});

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const listing = await getListingDetail(params.id);

  if (!listing) {
    return {
      title: "Listing",
      description: "Property listing not found.",
    };
  }

  const description = `${listing.title} in ${listing.neighbourhood ?? "Ibadan"} for ${formatMoneyNaira(listing.price)}.`;
  const image = listing.images?.[0];

  return {
    title: listing.title,
    description,
    openGraph: image
      ? {
          title: listing.title,
          description,
          images: [{ url: image }],
        }
      : undefined,
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const listing = await getListingDetail(params.id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-surface px-6 py-16 md:px-8">
        <div className="mx-auto w-full max-w-[1440px] rounded-[2rem] bg-surface-container-low p-10 text-on-surface-variant shadow-[var(--shadow-editorial-card)]">
          Listing not found.
        </div>
      </div>
    );
  }

  const supabase = createSupabasePublicClient();
  const [{ data: landlord }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, is_verified")
      .eq("id", listing.landlord_id)
      .single(),
    supabase
      .from("properties")
      .update({ views: (listing.views ?? 0) + 1 })
      .eq("id", listing.id),
  ]);

  const periodLabel = getPeriodLabel(listing.price_period);
  const monthlyEquivalent = getMonthlyEquivalent(listing.price, listing.price_period);
  const heroMeta = [
    {
      icon: "location_on",
      label: listing.neighbourhood ?? "Ibadan",
    },
    {
      icon: "bed",
      label: `${listing.bedrooms ?? 0} Bedrooms`,
    },
    {
      icon: "bathtub",
      label: `${listing.bathrooms ?? 0} Bathrooms`,
    },
    {
      icon: "home_work",
      label: toTitleCase(listing.property_type),
    },
  ].filter((item) => item.label);

  const highlightCards = [
    {
      icon: "payments",
      title: "Pricing cadence",
      copy: `Structured as ${formatMoneyNaira(listing.price)} per ${periodLabel}.`,
      accent: "bg-tertiary-fixed-dim/15",
    },
    {
      icon: "verified_user",
      title: "Verified landlord",
      copy: landlord?.is_verified
        ? "Landlord identity has been verified on Dwelio."
        : "Landlord profile is available on Dwelio for direct conversation.",
      accent: "bg-secondary-container",
    },
    {
      icon: "history_edu",
      title: "Digital process",
      copy:
        "This home can move through Dwelio's digital messaging, payment, and agreement flow.",
      accent: "bg-primary-fixed",
    },
    {
      icon: "location_city",
      title: "Neighbourhood context",
      copy: `${listing.neighbourhood ?? "Ibadan"} keeps the search grounded in a real location, not just a vague listing title.`,
      accent: "bg-surface-container-high",
    },
  ];

  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-on-surface-variant">
          <Link href="/search" className="transition hover:text-primary-container">
            Discover
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span>{listing.neighbourhood ?? "Ibadan"}</span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="font-bold text-primary-container">{listing.title}</span>
        </div>

        <section className="grid gap-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                {listing.type && (
                  <span className="rounded-full bg-primary-container px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary">
                    {toTitleCase(listing.type)}
                  </span>
                )}
                {listing.property_type && (
                  <span className="rounded-full bg-secondary-container px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container">
                    {toTitleCase(listing.property_type)}
                  </span>
                )}
                {landlord?.is_verified && (
                  <span className="rounded-full bg-tertiary-fixed-dim px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-tertiary-fixed">
                    Verified Landlord
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-headline text-4xl font-black tracking-[-0.05em] text-primary-container md:text-5xl lg:text-6xl">
                {listing.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-on-surface-variant">
                {listing.address}
                {listing.address && listing.neighbourhood ? ", " : ""}
                {listing.neighbourhood}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container-low"
                aria-label="Share listing"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-[var(--shadow-floating-pane)] transition hover:bg-surface-container-low"
                aria-label="Save listing"
              >
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-base font-semibold text-on-surface-variant">
            {heroMeta.map((item) => (
              <span key={`${item.icon}-${item.label}`} className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px] xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <div className="grid gap-12">
            <ImageGallery images={listing.images ?? []} title={listing.title} />

            {listing.video_url && (
              <section className="grid gap-5">
                <div>
                  <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                    Virtual Tour
                  </p>
                  <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                    Walk through the home before you visit.
                  </h2>
                </div>
                <div className="overflow-hidden rounded-[2rem] bg-primary shadow-[var(--shadow-elevated-panel)]">
                  <video controls className="w-full">
                    <source src={listing.video_url} />
                  </video>
                </div>
              </section>
            )}

            <section className="grid gap-5">
              <div>
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                  The Narrative
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                  A clearer picture of what this home offers.
                </h2>
              </div>

              <div className="rounded-[2rem] bg-surface-container-low p-8 shadow-[var(--shadow-editorial-card)]">
                <p className="max-w-4xl text-lg leading-9 text-on-surface-variant">
                  {listing.description ||
                    "This listing is live on Dwelio and ready for direct landlord conversation, digital payment handling, and a more trustworthy move-in process."}
                </p>
              </div>
            </section>

            <section className="grid gap-5">
              <div>
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                  Property Highlights
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                  Details that matter before you commit.
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {highlightCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[var(--shadow-editorial-card)]"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${card.accent} text-primary-container`}
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
                      >
                        {card.icon}
                      </span>
                    </div>
                    <h3 className="mt-5 font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                      {card.copy}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2.25rem] bg-primary-container px-8 py-10 text-on-primary shadow-[var(--shadow-elevated-panel)]">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[30px] text-tertiary-fixed-dim"
                      style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
                    >
                      verified_user
                    </span>
                    <h2 className="font-headline text-3xl font-black tracking-[-0.04em]">
                      Dwelio trust signals, without overstating the listing.
                    </h2>
                  </div>
                  <p className="mt-4 text-base leading-8 text-primary-fixed">
                    What we can say clearly here: the landlord can be contacted
                    directly, the payment flow supports escrow-backed checkout,
                    and the platform is designed to keep a stronger digital trail
                    than the usual offline process.
                  </p>
                </div>

                <div className="grid gap-3 rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-md">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-fixed">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim">
                      history_edu
                    </span>
                    Digital agreement flow available
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-fixed">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim">
                      payments
                    </span>
                    Escrow-supported payment path
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-fixed">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim">
                      chat
                    </span>
                    Direct landlord conversation
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-5">
              <div>
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                  Landlord
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                  The person behind the listing.
                </h2>
              </div>

              <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[var(--shadow-editorial-card)]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-surface-container shadow-[var(--shadow-floating-pane)]">
                    <Image
                      src={landlord?.avatar_url ?? "/vercel.svg"}
                      alt={landlord?.full_name ?? "Landlord"}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-headline text-3xl font-black tracking-[-0.03em] text-primary-container">
                      {landlord?.full_name ?? "Dwelio landlord"}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <span className="rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-container">
                        {landlord?.is_verified ? "Verified Identity" : "Profile Available"}
                      </span>
                      <span className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                        Direct conversation enabled
                      </span>
                    </div>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
                      Dwelio is built to help you speak directly with the person
                      listing the property, inspect the details more carefully,
                      and move into the payment and agreement flow with more
                      clarity than the usual back-and-forth.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2.25rem] bg-surface-container-lowest p-7 shadow-[var(--shadow-elevated-panel)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                Pricing
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
                  {formatMoneyNaira(listing.price)}
                </span>
                <span className="pb-1 text-base font-semibold text-on-surface-variant">
                  / {periodLabel}
                </span>
              </div>

              <div className="mt-8 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                  <span className="text-on-surface-variant">Monthly equivalent</span>
                  <span className="font-bold text-primary-container">
                    {formatMoneyNaira(monthlyEquivalent)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                  <span className="text-on-surface-variant">Property type</span>
                  <span className="font-bold text-primary-container">
                    {toTitleCase(listing.property_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                  <span className="text-on-surface-variant">Bedrooms</span>
                  <span className="font-bold text-primary-container">
                    {listing.bedrooms ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-on-surface-variant">Bathrooms</span>
                  <span className="font-bold text-primary-container">
                    {listing.bathrooms ?? 0}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <Link
                  href={`/payments/pay/${listing.id}`}
                  className="inline-flex h-14 items-center justify-center rounded-[1rem] bg-primary-container px-5 font-headline text-sm font-black uppercase tracking-[0.14em] text-on-primary transition hover:bg-primary"
                >
                  Secure with Escrow
                </Link>
                {landlord?.id && (
                  <MessageLandlordButton
                    landlordId={landlord.id}
                    propertyId={listing.id}
                  />
                )}
                <button
                  type="button"
                  className="inline-flex h-14 items-center justify-center rounded-[1rem] bg-surface-container-low px-5 font-headline text-sm font-black uppercase tracking-[0.14em] text-primary-container transition hover:bg-surface-container"
                >
                  Save Property
                </button>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-surface-container-low p-4">
                <p className="text-sm leading-7 text-on-surface-variant">
                  Payments on Dwelio are designed to move through a clearer
                  digital path, with escrow support before full release to the
                  landlord.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                Location
              </p>
              <h3 className="mt-3 font-headline text-2xl font-black tracking-[-0.03em] text-primary-container">
                {listing.neighbourhood ?? "Ibadan"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {listing.address || "Address shared directly in the listing and conversation flow."}
              </p>
              <div className="mt-5 rounded-[1.5rem] bg-surface-container-lowest p-4">
                <p className="text-sm font-semibold text-primary-container">
                  Listed on Dwelio for direct discovery and cleaner move-in
                  coordination.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
