import Link from "next/link";
import { CreditCard } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Please log in to view payments.
      </div>
    );
  }

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "id, amount, status, payment_month, property_id, created_at, properties(title)",
    )
    .eq("tenant_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">
            Payment history
          </h1>
          <p className="text-base text-slate-600">
            Track your rent payments and receipts.
          </p>
        </header>

        <div className="grid gap-4">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {payment.properties?.[0]?.title ?? "Property"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Month: {payment.payment_month ?? "Upcoming"}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  ₦{payment.amount?.toLocaleString()}
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {payment.status}
                  </span>
                  <Link
                    href={`/payments/pay/${payment.property_id}`}
                    className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300"
                  >
                    Pay now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-sm text-slate-600 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
              <CreditCard className="h-6 w-6 text-emerald-700" />
              <p className="mt-2 font-semibold text-slate-900">
                No payments yet
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Explore listings and start a payment when you’re ready.
              </p>
              <Link
                href="/search"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-emerald-200 px-4 text-xs font-semibold text-emerald-800"
              >
                Browse listings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
