"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  mode: "login" | "signup";
  redirectTo?: string;
  variant?: "default" | "admin";
};

const initialForm = {
  email: "",
  password: "",
};

export function AuthForm({ mode, redirectTo = "/account", variant = "default" }: AuthFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const copy = useMemo(
    () =>
      mode === "login"
        ? {
            button: "Sign In",
            heading: variant === "admin" ? "Admin sign in" : "Sign in to your account",
            secondaryHref: "/auth/sign-up",
            secondaryLabel: "Create an account",
            success: "",
          }
        : {
            button: "Create Account",
            heading: variant === "admin" ? "Create admin account" : "Create your customer account",
            secondaryHref: "/auth/login",
            secondaryLabel: "Already have an account?",
            success: "Account created successfully. You can now sign in.",
          },
    [mode, variant],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet. Add your environment values to enable authentication.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      setLoading(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setForm(initialForm);

    if (data.session) {
      router.replace(redirectTo);
      router.refresh();
      return;
    }

    setSuccess(copy.success);
  }

  return (
    <section className="track-page-surface">
      <div className="shell">
        <div className="tracking-search-card">
          <div className="form-title">
            <h3>{copy.heading}</h3>
            <p>
              {variant === "admin"
                ? "Use your Supabase admin email and password to manage shipments."
                : "Use your Supabase email and password to access your shipment account."}
            </p>
          </div>

          <form className="stack-form" onSubmit={onSubmit}>
            <input
              className="text-input"
              placeholder="Email address"
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              className="text-input"
              minLength={6}
              placeholder="Password"
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="form-success">{success}</p> : null}
            <button className="primary-button full-width page-search-button" disabled={loading} type="submit">
              {loading ? "Please wait..." : copy.button}
            </button>
          </form>

          {variant === "admin" ? null : (
            <p className="tracking-help">
              <Link href={copy.secondaryHref}>{copy.secondaryLabel}</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
