"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, role, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile?.full_name && profile?.phone && profile?.role) {
        router.push("/dashboard");
        return;
      }

      if (mounted && profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
        setRole(profile.role ?? "tenant");
      }

      if (mounted) setChecking(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

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

      const { error: detailsError } = await supabase
        .from("profiles")
        .update({ phone, avatar_url: avatarUrl, full_name: fullName })
        .eq("id", user.id);

      if (detailsError) {
        setError(detailsError.message);
        return;
      }

      const { data: existing } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!existing?.role) {
        const { error: roleError } = await supabase
          .from("profiles")
          .update({ role })
          .eq("id", user.id)
          .is("role", null);

        if (roleError) {
          setError(roleError.message);
          return;
        }
      }

      router.push("/dashboard");
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
          <div className="grid gap-4">
            <div className="h-6 w-40 animate-pulse rounded-full bg-emerald-100" />
            <div className="h-4 w-64 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 grid gap-3">
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
            </div>
            <p className="text-sm text-slate-500">Checking your profile…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] bg-surface-container-lowest p-10 shadow-[var(--shadow-elevated-panel)]">
        <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container mb-8">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              type="text"
              placeholder="Your full name"
              className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            />
          </label>
          <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              placeholder="Your phone number"
              className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
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
            <p className="rounded-[1rem] bg-error-container px-4 py-3 text-sm font-medium text-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-12 rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus:ring-4 focus:ring-primary-container/20"
          >
            {pending ? "Saving..." : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
