import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { tenantId, landlordId, propertyId, startDate, monthlyRent } = body ?? {};

  if (!tenantId || !landlordId || !propertyId || !startDate || !monthlyRent) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: property } = await supabase
    .from("properties")
    .select("id, address")
    .eq("id", propertyId)
    .single();

  const { data: landlord } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", landlordId)
    .single();

  const { data: tenant } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", tenantId)
    .single();

  if (!property || !landlord || !tenant) {
    return NextResponse.json({ error: "Invalid party data" }, { status: 400 });
  }

  const terms = `TENANCY AGREEMENT

This agreement is made between ${landlord.full_name} ("Landlord") and ${
    tenant.full_name
  } ("Tenant") for the property located at ${property.address}.

Start Date: ${startDate}
Monthly Rent: ₦${Number(monthlyRent).toLocaleString()}

Standard Terms:
1. Rent is payable monthly on the due date.
2. Tenant is responsible for keeping the property in good condition.
3. Landlord is responsible for major structural repairs.
4. Either party may terminate with one (1) month notice.
5. Late payments may incur penalties as agreed by both parties.
6. This agreement is governed by Nigerian tenancy laws.`;

  const { data: agreement, error } = await supabase
    .from("tenancy_agreements")
    .insert({
      tenant_id: tenantId,
      landlord_id: landlordId,
      property_id: propertyId,
      start_date: startDate,
      monthly_rent: monthlyRent,
      terms,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agreementId: agreement.id });
}
