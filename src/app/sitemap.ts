import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const supabase = await createSupabaseServerClient();
  const { data: listings } = await supabase
    .from("properties")
    .select("id")
    .eq("is_available", true);

  const siteUrl = process.env.NEXT_PUBLIC_SUPABASE_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/search",
    "/neighbourhoods",
    "/page",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const listingRoutes =
    listings?.map((listing) => ({
      url: `${siteUrl}/listings/${listing.id}`,
      lastModified: new Date(),
    })) ?? [];

  return [...staticRoutes, ...listingRoutes];
}
