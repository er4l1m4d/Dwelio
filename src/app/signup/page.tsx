"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const roles = [
  { id: "landlord", label: "Landlord", blurb: "List and manage properties" },
  { id: "tenant", label: "Tenant", blurb: "Find and rent homes" },
  { id: "buyer", label: "Buyer", blurb: "Browse verified listings" },
] as const;

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "tenant",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
            role: form.role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: form.fullName,
          phone: form.phone,
          role: form.role,
        });

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      setSuccess(
        "Account created. Check your email to confirm, then continue onboarding.",
      );
      router.push("/onboarding");
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f3e8,_#ffffff_45%,_#f0f7f3)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-emerald-100 bg-white/80 p-10 shadow-[0_30px_80px_rgba(16,42,24,0.08)] backdrop-blur">
        <header className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Dwelio
            <span className="text-emerald-400">•</span>
            Create account
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find homes in Ibadan without the hassle.
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Join Dwelio to list, discover, and secure verified properties with
            flexible monthly payments.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Full name
                <input
                  value={form.fullName}
                  onChange={(event) => handleChange("fullName")(event.target.value)}
                  required
                  type="text"
                  placeholder="Adeola Johnson"
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
                  placeholder="+234 812 000 0000"
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email address
              <input
                value={form.email}
                onChange={(event) => handleChange("email")(event.target.value)}
                required
                type="email"
                placeholder="you@dwelio.ng"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input
                value={form.password}
                onChange={(event) => handleChange("password")(event.target.value)}
                required
                type="password"
                placeholder="Create a secure password"
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
              />
            </label>

            <div className="grid gap-3">
              <p className="text-sm font-medium text-slate-700">Select your role</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleChange("role")(role.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      form.role === role.id
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {role.label}
                    </p>
                    <p className="text-xs text-slate-500">{role.blurb}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold text-emerald-900">
                What you get with Dwelio
              </h2>
              <ul className="grid gap-3 text-sm text-emerald-900">
                <li>Verified listings with trusted landlords</li>
                <li>Monthly rent payments with escrow protection</li>
                <li>Digital tenancy agreements and receipts</li>
              </ul>
            </div>

            <div className="grid gap-3">
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-700">
                  {success}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? "Creating account..." : "Create Dwelio account"}
              </button>
              <p className="text-xs text-slate-500">
                By signing up, you agree to Dwelio’s Terms and Privacy Policy.
              </p>
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link className="font-semibold text-emerald-800" href="/login">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
