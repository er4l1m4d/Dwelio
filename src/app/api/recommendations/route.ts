import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { budgetMin, budgetMax, neighbourhoods, bedrooms, propertyType } =
    body ?? {};

  const { data: listings } = await supabase
    .from("properties")
    .select(
      "id, title, price, price_period, neighbourhood, bedrooms, property_type, type",
    )
    .eq("is_available", true);

  const prompt = `You are recommending the top 5 properties for a tenant.
Preferences:
- Budget: ${budgetMin ?? "any"} to ${budgetMax ?? "any"}
- Neighbourhoods: ${Array.isArray(neighbourhoods) ? neighbourhoods.join(", ") : "any"}
- Bedrooms: ${bedrooms ?? "any"}
- Property type: ${propertyType ?? "any"}

Return a JSON array of up to 5 items with:
[{ "id": string, "reason": string }]

Properties:
${JSON.stringify(listings ?? [])}`;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: errorText }, { status: 500 });
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ??
    "";

  let recommendations: Array<{ id: string; reason: string }> = [];

  try {
    recommendations = JSON.parse(text);
  } catch {
    recommendations = [];
  }

  return NextResponse.json({ recommendations });
}
