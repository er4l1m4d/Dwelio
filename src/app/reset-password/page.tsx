"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Password updated. You can log in now.");
      router.push("/login");
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--color-surface-container-highest),_var(--color-surface)_45%,_var(--color-secondary-fixed))] px-6 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-surface-container-lowest p-10 shadow-[var(--shadow-elevated-panel)]">
        <div className="grid gap-6">
          <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">
            Set a new password
          </h1>
          <p className="text-base text-on-surface-variant">
            Choose a strong password you’ll remember.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              New password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                placeholder="Create a new password"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
            <label className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Confirm password
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                placeholder="Re-enter your password"
                className="h-12 w-full rounded-[1rem] border border-outline-variant/40 bg-surface-container-lowest px-4 text-base font-medium text-primary-container outline-none transition focus:border-primary-container/20 focus:ring-4 focus:ring-surface-tint/10"
              />
            </label>
            {error && (
              <p className="rounded-[1rem] bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-[1rem] bg-primary-fixed-dim px-4 py-3 text-sm font-medium text-on-primary-container">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="h-12 rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus:ring-4 focus:ring-primary-container/20"
            >
              {pending ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
