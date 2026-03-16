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
  const { propertyId, landlordId, amount, reference } = body ?? {};

  if (!propertyId || !landlordId || !amount || !reference) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("payments").insert({
    tenant_id: user.id,
    landlord_id: landlordId,
    property_id: propertyId,
    amount,
    status: "pending",
    paystack_reference: reference,
    payment_month: new Date().toISOString().slice(0, 10),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
