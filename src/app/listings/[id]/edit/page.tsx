"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type EditListingPageProps = {
  params: { id: string };
};

type ListingForm = {
  title: string;
  description: string;
  type: "rent" | "sale";
  property_type: "flat" | "house" | "room" | "duplex" | "bungalow" | "land";
  price: string;
  price_period: "monthly" | "yearly";
  bedrooms: string;
  bathrooms: string;
  address: string;
  neighbourhood: string;
};

export default function EditListingPage({ params }: EditListingPageProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ListingForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadListing = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("properties")
        .select(
          "id, landlord_id, title, description, type, property_type, price, price_period, bedrooms, bathrooms, address, neighbourhood",
        )
        .eq("id", params.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data?.landlord_id !== user.id) {
        router.push("/dashboard");
        return;
      }

      if (mounted && data) {
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          type: data.type ?? "rent",
          property_type: data.property_type ?? "flat",
          price: String(data.price ?? ""),
          price_period: data.price_period ?? "monthly",
          bedrooms: String(data.bedrooms ?? ""),
          bathrooms: String(data.bathrooms ?? ""),
          address: data.address ?? "",
          neighbourhood: data.neighbourhood ?? "",
        });
        setLoading(false);
      }
    };

    loadListing();

    return () => {
      mounted = false;
    };
  }, [params.id, router, supabase]);

  const updateForm =
    <T extends keyof ListingForm>(field: T) =>
    (value: ListingForm[T]) =>
      setForm((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form) return;

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to update this listing.");
        return;
      }

      const { error: updateError } = await supabase
        .from("properties")
        .update({
          title: form.title,
          description: form.description,
          type: form.type,
          property_type: form.property_type,
          price: Number(form.price),
          price_period: form.price_period,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          address: form.address,
          neighbourhood: form.neighbourhood,
        })
        .eq("id", params.id)
        .eq("landlord_id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push(`/listings/${params.id}`);
    });
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Loading listing...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <div className="grid gap-6">
          <h1 className="text-3xl font-semibold text-slate-900">Edit listing</h1>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Title
              <input
                value={form.title}
                onChange={(event) => updateForm("title")(event.target.value)}
                type="text"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description")(event.target.value)}
                rows={4}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Listing type
                <select
                  value={form.type}
                  onChange={(event) =>
                    updateForm("type")(event.target.value as ListingForm["type"])
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                >
                  <option value="rent">RENT</option>
                  <option value="sale">SALE</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Property type
                <select
                  value={form.property_type}
                  onChange={(event) =>
                    updateForm("property_type")(
                      event.target.value as ListingForm["property_type"],
                    )
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                >
                  <option value="flat">FLAT</option>
                  <option value="house">HOUSE</option>
                  <option value="room">ROOM</option>
                  <option value="duplex">DUPLEX</option>
                  <option value="bungalow">BUNGALOW</option>
                  <option value="land">LAND</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Price
                <input
                  value={form.price}
                  onChange={(event) => updateForm("price")(event.target.value)}
                  type="number"
                  min={0}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Price period
                <select
                  value={form.price_period}
                  onChange={(event) =>
                    updateForm("price_period")(
                      event.target.value as ListingForm["price_period"],
                    )
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                >
                  <option value="monthly">MONTHLY</option>
                  <option value="yearly">YEARLY</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Bedrooms
                <input
                  value={form.bedrooms}
                  onChange={(event) =>
                    updateForm("bedrooms")(event.target.value)
                  }
                  type="number"
                  min={0}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Bathrooms
                <input
                  value={form.bathrooms}
                  onChange={(event) =>
                    updateForm("bathrooms")(event.target.value)
                  }
                  type="number"
                  min={0}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Address
              <input
                value={form.address}
                onChange={(event) => updateForm("address")(event.target.value)}
                type="text"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Neighbourhood
              <input
                value={form.neighbourhood}
                onChange={(event) =>
                  updateForm("neighbourhood")(event.target.value)
                }
                type="text"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
