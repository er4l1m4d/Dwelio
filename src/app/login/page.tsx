"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const redirectParam =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("redirect");
  const redirectPath =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  const handleGoogleSignIn = () => {
    setError(null);
    startTransition(async () => {
      let redirectTo = `${window.location.origin}${redirectPath}`;

      if (process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL) {
        try {
          const configuredUrl = new URL(
            process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL,
          );
          redirectTo = new URL(redirectPath, configuredUrl.origin).toString();
        } catch {
          redirectTo = `${window.location.origin}${redirectPath}`;
        }
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(redirectPath);
    });
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-4xl rounded-[2rem] bg-surface-container-lowest p-10 shadow-[var(--shadow-elevated-panel)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-fixed px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary-container">
              Dwelio
              <span className="text-surface-tint">•</span>
              Welcome back
            </div>
            <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
              Log in to your workspace.
            </h1>
            <p className="text-base text-on-surface-variant">
              Manage listings, messages, and payments all in one place.
            </p>
            <div className="rounded-[1.5rem] bg-surface-container-low p-6 text-sm text-on-surface-variant">
              <p className="font-bold text-primary-container">New to Dwelio?</p>
              <p className="mt-2 text-on-surface-variant">
                Create a free account and start listing or browsing verified homes.
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-flex items-center font-headline font-bold text-surface-tint transition hover:text-primary-container"
              >
                Create an account →
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Email address
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                placeholder="you@dwelio.ng"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
            <div className="flex items-center justify-between text-sm text-on-surface-variant">
              <span className="font-medium">Secure sign-in</span>
              <Link className="font-headline font-bold text-surface-tint transition hover:text-primary-container" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="rounded-[1rem] bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-12 rounded-full border border-outline-variant/40 bg-surface-container-lowest px-6 font-headline text-sm font-bold text-primary-container transition hover:bg-surface-container-low focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
            >
              Continue with Google
            </button>
            <button
              type="submit"
              disabled={pending}
              className="h-12 rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus:ring-4 focus:ring-primary-container/20"
            >
              {pending ? "Signing in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
