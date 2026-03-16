"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("tenant");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please log in to complete onboarding.");
        return;
      }

      let avatarUrl: string | null = null;
      if (avatarFile) {
        const filePath = `${user.id}/${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ phone, avatar_url: avatarUrl, full_name: fullName, role })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <div className="grid gap-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Finish setting up your profile
          </h1>
          <p className="text-base text-slate-600">
            Add a profile photo and confirm your phone number.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                type="text"
                placeholder="Your full name"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone number
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                type="tel"
                placeholder="+234 812 000 0000"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="buyer">Buyer</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Profile photo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800"
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
              {pending ? "Saving..." : "Complete onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
