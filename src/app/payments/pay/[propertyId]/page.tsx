"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { PaystackButton } from "react-paystack";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Property = {
  id: string;
  title: string;
  price: number | null;
  landlord_id: string;
};

export default function PayRentPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [property, setProperty] = useState<Property | null>(null);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId;

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error: fetchError } = await supabase
        .from("properties")
        .select("id, title, price, landlord_id")
        .eq("id", propertyId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProperty(data as Property);
    };

    if (propertyId) {
      load();
    }
  }, [propertyId, router, supabase]);

  const rentAmount = property?.price ?? 0;
  const serviceFee = Math.round(rentAmount * 0.03);
  const totalAmount = rentAmount + serviceFee;

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
        ],
      },
    }),
    [email, property?.id, totalAmount],
  );

  const handleSuccess = (reference: { reference: string }) => {
    if (!property) return;
    startTransition(async () => {
      await fetch("/api/payments/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          landlordId: property.landlord_id,
          amount: totalAmount,
          reference: reference.reference,
        }),
      });
      router.push("/payments");
    });
  };

  if (!property) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <div className="grid gap-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Pay rent for {property.title}
          </h1>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
            <div className="flex justify-between">
              <span>Monthly rent</span>
              <span>₦{rentAmount.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Dwelio service fee (3%)</span>
              <span>₦{serviceFee.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <PaystackButton
            {...paystackConfig}
            onSuccess={handleSuccess}
            onClose={() => undefined}
            className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending || !paystackConfig.publicKey}
          >
            {pending ? "Processing..." : "Pay now"}
          </PaystackButton>
          {!paystackConfig.publicKey && (
            <p className="text-xs text-slate-500">
              Add `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` to enable payments.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
