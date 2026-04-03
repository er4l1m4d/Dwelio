"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { PaystackButton } from "react-paystack";
import MessageLandlordButton from "@/components/messages/MessageLandlordButton";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Property = {
  id: string;
  title: string;
  price: number | null;
  price_period: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string | null;
  neighbourhood: string | null;
  images: string[] | null;
  landlord_id: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
};

const formatMoney = (value: number | null | undefined) =>
  `₦${new Intl.NumberFormat("en-NG").format(value ?? 0)}`;

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

const getMonthlyEquivalent = (
  value: number | null | undefined,
  period?: string | null,
) => {
  const normalized = period?.toLowerCase() ?? "";

  if (normalized === "yearly" || normalized === "annual" || normalized === "year") {
    return Math.round((value ?? 0) / 12);
  }

  return value ?? 0;
};

const getAgreementPreview = ({
  landlordName,
  tenantName,
  property,
  monthlyEquivalent,
}: {
  landlordName: string;
  tenantName: string;
  property: Property;
  monthlyEquivalent: number;
}) => [
  `This tenancy preview is prepared between ${landlordName} ("Landlord") and ${tenantName} ("Tenant").`,
  `Property: ${property.address || property.title}${property.neighbourhood ? `, ${property.neighbourhood}` : ""}.`,
  `Billing cadence: ${formatMoney(monthlyEquivalent)} per month, routed through Dwelio's digital checkout flow.`,
  "Escrow support: funds are held in a protected flow before final landlord release, helping both parties complete inspection and move-in with a clearer paper trail.",
  "Agreement step: final signing and long-form agreement execution continue in the agreement flow after payment confirmation.",
];

export default function PayRentPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [pending, startTransition] = useTransition();
  const [property, setProperty] = useState<Property | null>(null);
  const [landlord, setLandlord] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId;

  useEffect(() => {
    if (!propertyId) return;

    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw new Error(authError.message);

        if (!user) {
          router.replace("/login");
          return;
        }

        if (!isActive) return;
        setEmail(user.email ?? "");

        const [profileResult, propertyResult] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("id", user.id).single(),
          supabase
            .from("properties")
            .select(
              "id, title, price, price_period, bedrooms, bathrooms, address, neighbourhood, images, landlord_id",
            )
            .eq("id", propertyId)
            .single(),
        ]);

        if (propertyResult.error) throw new Error(propertyResult.error.message);

        const propertyData = propertyResult.data as Property | null;

        if (!propertyData) throw new Error("We couldn't find this home anymore.");

        if (!isActive) return;

        const resolvedTenantName =
          profileResult.data?.full_name ?? user.email?.split("@")[0] ?? "Tenant";

        setTenantName(resolvedTenantName);
        setSignatureName(profileResult.data?.full_name ?? "");
        setProperty(propertyData);

        const { data: landlordData, error: landlordError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, is_verified")
          .eq("id", propertyData.landlord_id)
          .single();

        if (landlordError && landlordError.code !== "PGRST116") {
          throw new Error(landlordError.message);
        }

        if (!isActive) return;
        setLandlord((landlordData as Profile | null) ?? null);
      } catch (loadError) {
        if (!isActive) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "We couldn't load your checkout right now.",
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [propertyId, router, supabase]);

  const rentAmount = property?.price ?? 0;
  const monthlyEquivalent = getMonthlyEquivalent(
    property?.price,
    property?.price_period,
  );
  const totalPlatformFees = Math.round(rentAmount * 0.03);
  const serviceFee = Math.floor((totalPlatformFees * 2) / 3);
  const escrowFee = totalPlatformFees - serviceFee;
  const totalAmount = rentAmount + totalPlatformFees;
  const periodLabel = getPeriodLabel(property?.price_period);
  const landlordName = landlord?.full_name ?? "Dwelio landlord";
  const agreementPreview =
    property &&
    getAgreementPreview({
      landlordName,
      tenantName: tenantName || "Tenant",
      property,
      monthlyEquivalent,
    });

  const paystackConfig = useMemo(
    () => ({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
      email,
      amount: totalAmount * 100,
      metadata: {
        custom_fields: [
          {
            display_name: "Property ID",
            variable_name: "property_id",
            value: property?.id ?? "",
          },
          {
            display_name: "Property title",
            variable_name: "property_title",
            value: property?.title ?? "",
          },
        ],
      },
    }),
    [email, property?.id, property?.title, totalAmount],
  );

  const handleSuccess = (reference: { reference: string }) => {
    if (!property) return;

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/payments/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            landlordId: property.landlord_id,
            amount: totalAmount,
            reference: reference.reference,
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.error ?? "Payment confirmation failed.");
        }

        router.push("/payments");
      } catch (paymentError) {
        setError(
          paymentError instanceof Error
            ? paymentError.message
            : "Your payment went through, but we couldn't confirm it in Dwelio yet.",
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-12">
          <div className="animate-pulse space-y-8 lg:col-span-7">
            <div className="h-6 w-40 rounded-full bg-surface-container" />
            <div className="h-14 w-4/5 rounded-[1.5rem] bg-surface-container-low" />
            <div className="rounded-[2rem] bg-surface-container-low p-8">
              <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="aspect-[4/3] rounded-[1.5rem] bg-surface-container" />
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded-full bg-surface-container" />
                  <div className="h-5 w-2/3 rounded-full bg-surface-container" />
                  <div className="flex gap-3">
                    <div className="h-10 w-28 rounded-full bg-surface-container" />
                    <div className="h-10 w-28 rounded-full bg-surface-container" />
                  </div>
                  <div className="h-20 rounded-[1.25rem] bg-surface-container" />
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-surface-container-low p-8">
              <div className="h-8 w-60 rounded-full bg-surface-container" />
              <div className="mt-6 h-72 rounded-[1.5rem] bg-surface-container" />
            </div>
          </div>

          <div className="animate-pulse space-y-6 lg:col-span-5">
            <div className="rounded-[2rem] bg-primary-container/90 p-8">
              <div className="h-8 w-40 rounded-full bg-white/15" />
              <div className="mt-8 space-y-4">
                <div className="h-5 rounded-full bg-white/10" />
                <div className="h-5 rounded-full bg-white/10" />
                <div className="h-5 rounded-full bg-white/10" />
                <div className="h-20 rounded-[1.5rem] bg-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
              <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
              <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
              <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-surface-container-low p-8 shadow-[var(--shadow-editorial-card)]">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
            Secure Checkout
          </p>
          <h1 className="mt-4 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
            We couldn&apos;t load this payment screen.
          </h1>
          <p className="mt-4 text-base leading-8 text-on-surface-variant">
            {error ??
              "The listing may have changed, or the checkout details are unavailable right now."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-primary-container px-5 font-headline text-sm font-black uppercase tracking-[0.14em] text-on-primary transition hover:bg-primary"
            >
              Return to discovery
            </Link>
            <Link
              href="/payments"
              className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-surface-container-lowest px-5 font-headline text-sm font-black uppercase tracking-[0.14em] text-primary-container transition hover:bg-surface-container"
            >
              View payments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-tertiary-fixed-dim px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-on-tertiary-fixed">
              Secure Checkout
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-outline" />
            <span className="text-sm font-medium text-on-surface-variant">
              Step 3 of 3
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl font-headline text-4xl font-black tracking-[-0.05em] text-primary-container sm:text-5xl md:text-6xl">
            Complete your secure tenancy.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-on-surface-variant">
            Review the home, confirm the payment breakdown, and move into
            Dwelio&apos;s escrow-backed checkout with a clearer digital trail.
          </p>
        </header>

        {error && (
          <div className="mb-8 rounded-[1.5rem] border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container">
            {error}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)] md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                    Booking Summary
                  </p>
                  <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                    Checkout for {property.title}
                  </h2>
                </div>
                <Link
                  href={`/listings/${property.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-container transition hover:text-on-tertiary-container"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Back to listing
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-surface-container">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-container text-on-primary">
                      <span
                        className="material-symbols-outlined text-5xl"
                        style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                      >
                        home_work
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                        {property.title}
                      </h3>
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px] text-primary-container">
                          location_on
                        </span>
                        {property.address || property.neighbourhood || "Ibadan"}
                        {property.address && property.neighbourhood
                          ? `, ${property.neighbourhood}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-on-surface-variant">
                        Rent ({periodLabel})
                      </p>
                      <p className="font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                        {formatMoney(rentAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-primary-container px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary">
                      Escrow Backed
                    </span>
                    <span className="rounded-full bg-secondary-container px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container">
                      {property.bedrooms ?? 0} Beds / {property.bathrooms ?? 0} Baths
                    </span>
                    {landlord?.is_verified && (
                      <span className="rounded-full bg-tertiary-fixed-dim px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-tertiary-fixed">
                        Verified Landlord
                      </span>
                    )}
                  </div>

                  <div className="mt-6 rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-[var(--shadow-floating-pane)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-surface-container">
                          {landlord?.avatar_url ? (
                            <Image
                              src={landlord.avatar_url}
                              alt={landlordName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-primary-fixed text-primary-container">
                              <span className="material-symbols-outlined">
                                person
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                            Landlord
                          </p>
                          <p className="font-headline text-xl font-black tracking-[-0.03em] text-primary-container">
                            {landlordName}
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            Direct landlord communication stays available during
                            checkout.
                          </p>
                        </div>
                      </div>

                      {landlord?.id && (
                        <div className="sm:ml-auto sm:w-[220px]">
                          <MessageLandlordButton
                            landlordId={landlord.id}
                            propertyId={property.id}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-on-tertiary-container">
                    Tenancy Agreement
                  </p>
                  <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-primary-container">
                    Agreement preview before payment confirmation.
                  </h2>
                </div>
                <span className="text-sm font-bold text-primary-container">
                  Final signing continues after payment confirmation
                </span>
              </div>

              <div className="mt-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[var(--shadow-editorial-card)] md:p-8">
                <div className="h-[24rem] overflow-y-auto rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-low px-6 py-6">
                  <h3 className="text-center font-headline text-xl font-black tracking-[-0.03em] text-primary-container">
                    MEMORANDUM OF TENANCY PREVIEW
                  </h3>
                  <div className="mt-6 space-y-4 text-sm leading-8 text-on-surface-variant">
                    {agreementPreview?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-secondary-container/35 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <label
                      htmlFor="signature-name"
                      className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant"
                    >
                      Digital signature
                    </label>
                    <input
                      id="signature-name"
                      type="text"
                      readOnly
                      value={signatureName}
                      placeholder="Your profile name appears here after payment confirmation"
                      className="mt-3 h-14 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 font-headline text-lg italic text-primary-container outline-none placeholder:text-on-surface-variant/60"
                    />
                    <p className="mt-3 text-xs leading-6 text-on-surface-variant">
                      This revamp keeps the signature area visible, but final
                      agreement execution still happens in the dedicated
                      agreement flow after payment.
                    </p>
                  </div>

                  <div className="inline-flex h-14 items-center justify-center rounded-[1rem] bg-primary-container/10 px-5 font-headline text-xs font-black uppercase tracking-[0.18em] text-primary-container">
                    Agreement step follows checkout
                  </div>
                </div>
              </div>
            </section>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-primary-container p-6 text-on-primary shadow-[var(--shadow-elevated-panel)] md:p-8">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-10%] top-[-15%] h-56 w-56 rounded-full bg-primary-fixed/10 blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] h-48 w-48 rounded-full bg-tertiary-fixed-dim/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed-dim">
                  Secure Payment
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em]">
                  Confirm the amount before Dwelio takes you to Paystack.
                </h2>

                <div className="mt-8 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4 text-primary-fixed">
                    <span>Rent amount</span>
                    <span>{formatMoney(rentAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-primary-fixed">
                    <span>Dwelio service fee</span>
                    <span>{formatMoney(serviceFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-primary-fixed">
                    <span>Escrow handling</span>
                    <span>{formatMoney(escrowFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-fixed-dim">
                        Total payable
                      </p>
                      <p className="mt-2 font-headline text-4xl font-black tracking-[-0.04em]">
                        {formatMoney(totalAmount)}
                      </p>
                    </div>
                    <span
                      className="material-symbols-outlined text-5xl text-tertiary-fixed-dim"
                      style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                    >
                      verified_user
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-primary-fixed/70">
                    Payment secured by Dwelio escrow support
                  </p>

                  <PaystackButton
                    {...paystackConfig}
                    onSuccess={handleSuccess}
                    onClose={() => undefined}
                    className="inline-flex h-16 w-full items-center justify-center rounded-[1.25rem] bg-surface-container-lowest px-6 font-headline text-sm font-black uppercase tracking-[0.14em] text-primary-container transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={pending || !paystackConfig.publicKey}
                  >
                    {pending ? "Processing payment..." : "Secure with Paystack"}
                  </PaystackButton>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                    <p className="text-sm leading-7 text-primary-fixed">
                      Your payment enters a protected flow before release to the
                      landlord, giving room for inspection and cleaner move-in
                      coordination.
                    </p>
                  </div>
                </div>

                {!paystackConfig.publicKey && (
                  <p className="mt-4 text-xs leading-6 text-primary-fixed">
                    Add <code>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> to enable
                    live checkout on this screen.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-surface-container-low p-4 shadow-[var(--shadow-editorial-card)] md:p-5">
                <span
                  className="material-symbols-outlined text-primary-container"
                  style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                >
                  security
                </span>
                <h3 className="mt-4 font-headline text-lg font-black tracking-[-0.03em] text-primary-container">
                  Protected
                </h3>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  The checkout flow is built to preserve a clearer digital trail
                  than the usual offline process.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-surface-container-low p-4 shadow-[var(--shadow-editorial-card)] md:p-5">
                <span
                  className="material-symbols-outlined text-primary-container"
                  style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                >
                  visibility
                </span>
                <h3 className="mt-4 font-headline text-lg font-black tracking-[-0.03em] text-primary-container">
                  Transparent
                </h3>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Rent, service fee, and escrow handling are broken out before
                  you leave the page to pay.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-surface-container-low p-4 shadow-[var(--shadow-editorial-card)] md:p-5">
                <span
                  className="material-symbols-outlined text-primary-container"
                  style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                >
                  group_off
                </span>
                <h3 className="mt-4 font-headline text-lg font-black tracking-[-0.03em] text-primary-container">
                  Direct
                </h3>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Checkout stays anchored to the actual property and landlord
                  instead of anonymous middlemen.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-surface-container-low p-4 shadow-[var(--shadow-editorial-card)] md:p-5">
                <span
                  className="material-symbols-outlined text-primary-container"
                  style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                >
                  support_agent
                </span>
                <h3 className="mt-4 font-headline text-lg font-black tracking-[-0.03em] text-primary-container">
                  Supported
                </h3>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Need help before you pay? Reach the landlord from this page or
                  continue through Dwelio support.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-[var(--shadow-editorial-card)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-fixed-dim/20 text-on-tertiary-container">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline text-lg font-black tracking-[-0.03em] text-primary-container">
                  Need help before checkout?
                </h3>
                <p className="text-sm leading-7 text-on-surface-variant">
                  Our support and transaction flow are designed to keep rent
                  payments clearer, safer, and easier to trace.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
