import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { paymentId } = body ?? {};

  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, tenant_id, landlord_id, status, amount, move_in_confirmed")
    .eq("id", paymentId)
    .single();

  if (!payment || payment.tenant_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (payment.status !== "in_escrow" || !payment.move_in_confirmed) {
    return NextResponse.json({ error: "Payment not eligible" }, { status: 400 });
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id, balance")
    .eq("user_id", payment.landlord_id)
    .single();

  if (!wallet) {
    await supabase.from("wallets").insert({
      user_id: payment.landlord_id,
      balance: payment.amount,
    });
  } else {
    await supabase
      .from("wallets")
      .update({ balance: (wallet.balance ?? 0) + payment.amount })
      .eq("id", wallet.id);
  }

  const { error } = await supabase
    .from("payments")
    .update({ status: "released" })
    .eq("id", payment.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
