"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    avatarUrl: "",
    role: "tenant",
  });
  const [confirmRoleChange, setConfirmRoleChange] = useState(false);
  const [needsReauth, setNeedsReauth] = useState(true);
  const [reauthPassword, setReauthPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", user.id)
        .single();

      if (mounted && data) {
        setForm({
          fullName: data.full_name ?? "",
          phone: data.phone ?? "",
          avatarUrl: data.avatar_url ?? "",
          role: data.role ?? "tenant",
        });
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const handleChange = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to update your profile.");
        return;
      }

      if (confirmRoleChange === false) {
        setError("Please confirm before changing your role.");
        return;
      }

      if (needsReauth) {
        setError("Please re-authenticate before changing your role.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: form.fullName,
          phone: form.phone,
          avatar_url: form.avatarUrl,
          role: form.role,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess("Profile updated successfully.");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_50%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <div className="grid gap-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Profile settings
          </h1>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input
                value={form.fullName}
                onChange={(event) => handleChange("fullName")(event.target.value)}
                required
                type="text"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone number
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone")(event.target.value)}
                required
                type="tel"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Avatar URL
              <input
                value={form.avatarUrl}
                onChange={(event) => handleChange("avatarUrl")(event.target.value)}
                type="url"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Role
              <select
                value={form.role}
                onChange={(event) => handleChange("role")(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="buyer">Buyer</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={confirmRoleChange}
                onChange={(event) => setConfirmRoleChange(event.target.checked)}
              />
              I understand changing roles affects my dashboard and listing access.
            </label>
            <div className="grid gap-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                Re-authenticate to change role
              </p>
              <p className="text-xs text-slate-500">
                If you signed in with Google, log out and sign in again to
                re-authenticate.
              </p>
              <input
                type="password"
                value={reauthPassword}
                onChange={(event) => setReauthPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-10 rounded-xl border border-slate-200 px-3"
              />
              <button
                type="button"
                onClick={async () => {
                  setError(null);
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();

                  if (!user?.email) {
                    setError("No email found for re-authentication.");
                    return;
                  }

                  const { error: reauthError } =
                    await supabase.auth.signInWithPassword({
                      email: user.email,
                      password: reauthPassword,
                    });

                  if (reauthError) {
                    setNeedsReauth(true);
                    setError("Re-authentication failed. Please try again.");
                    return;
                  }

                  setNeedsReauth(false);
                  setReauthPassword("");
                }}
                className="h-10 w-fit rounded-full border border-emerald-200 px-4 text-xs font-semibold text-emerald-800"
              >
                Confirm password
              </button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
                className="h-10 w-fit rounded-full border border-emerald-200 px-4 text-xs font-semibold text-emerald-800"
              >
                Sign out
              </button>
            </div>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
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
