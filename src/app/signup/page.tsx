"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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

  const handleGoogleSignIn = () => {
    setError(null);
    startTransition(async () => {
      const redirectTo =
        process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ??
        `${window.location.origin}/onboarding`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    });
  };

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--color-surface-container-highest),_var(--color-surface)_45%,_var(--color-secondary-fixed))] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[2rem] bg-surface-container-lowest p-10 shadow-[var(--shadow-elevated-panel)]">
  <header className="flex flex-col gap-4">
          <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
            Find homes in Ibadan without the hassle.
          </h1>
          <p className="max-w-2xl text-base text-on-surface-variant">
            Join Dwelio to list, discover, and secure verified properties with
            flexible monthly payments.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-1">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Full name
                <input
                  value={form.fullName}
                  onChange={(event) => handleChange("fullName")(event.target.value)}
                  required
                  type="text"
                  placeholder="Adeola Johnson"
                  className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
                />
              </label>
              <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Phone number
                <input
                  value={form.phone}
                  onChange={(event) => handleChange("phone")(event.target.value)}
                  required
                  type="tel"
                  placeholder="+234 812 000 0000"
                  className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
                />
              </label>
            </div>
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Email address
              <input
                value={form.email}
                onChange={(event) => handleChange("email")(event.target.value)}
                required
                type="email"
                placeholder="you@dwelio.ng"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Password
              <input
                value={form.password}
                onChange={(event) => handleChange("password")(event.target.value)}
                required
                type="password"
                placeholder="Create a secure password"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>

            <div className="grid gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                I am a
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleChange("role")(role.id)}
                    aria-pressed={form.role === role.id}
                    className={`flex flex-col items-start gap-1 rounded-[1.5rem] border p-4 transition-all ${
                      form.role === role.id
                        ? "border-primary-container bg-surface-container-low"
                        : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline-variant"
                    }`}
                  >
                    <span className="font-headline text-sm font-bold text-primary-container">
                      {role.label}
                    </span>
                    <span className="text-left text-[11px] font-medium text-on-surface-variant">
                      {role.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-[1rem] bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-[1rem] bg-primary-fixed-dim px-4 py-3 text-sm font-medium text-on-primary-container">
                {success}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus:ring-4 focus:ring-primary-container/20"
            >
              {pending ? "Creating account..." : "Continue"}
            </button>

            {/* Divider with OR and the alternative sign-in block placed under the primary CTA */}
            <div className="flex items-center gap-4">
              <span className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-sm font-medium text-on-surface-variant">OR</span>
              <span className="flex-1 h-px bg-outline-variant/30" />
            </div>

            <div className="rounded-[2rem] bg-surface-container p-6">
              <h3 className="font-headline text-lg font-black tracking-[-0.02em] text-primary-container">
                Prefer a faster start?
              </h3>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-4 h-12 w-full rounded-full border border-outline-variant/40 bg-surface-container-lowest px-6 font-headline text-sm font-bold text-primary-container transition hover:bg-surface-container-low focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              >
                Continue with Google
              </button>
              <div className="mt-4 border-t border-outline-variant/30 pt-4">
                <p className="text-sm font-medium text-on-surface-variant">
                  Already have an account?{' '}
                  <Link className="font-headline font-bold text-surface-tint transition hover:text-primary-container" href="/login">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
