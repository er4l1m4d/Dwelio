import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EarningsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Please log in to view earnings.
      </div>
    );
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, status, payment_month, tenant_id, properties(title)")
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false });

  const totalEarned =
    payments?.reduce((sum, payment) => sum + (payment.amount ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">Earnings</h1>
          <p className="text-base text-slate-600">
            Track your income and withdrawals.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
            <p className="text-sm text-slate-500">Wallet balance</p>
            <p className="text-2xl font-semibold text-slate-900">
              ₦{(wallet?.balance ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
            <p className="text-sm text-slate-500">Total earned</p>
            <p className="text-2xl font-semibold text-slate-900">
              ₦{totalEarned.toLocaleString()}
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
            <p className="text-sm text-slate-500">Withdrawals</p>
            <button
              type="button"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full border border-emerald-200 px-4 text-sm font-semibold text-emerald-800"
            >
              Withdraw to bank
            </button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Incoming payments
          </h2>
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {payment.properties?.title ?? "Property"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Month: {payment.payment_month ?? "Upcoming"}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  ₦{payment.amount?.toLocaleString()}
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {payment.status}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-sm text-slate-600 shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
              No payments yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
