"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton({ redirectTo = "/admin/login" }: { redirectTo?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <button className="secondary-button" disabled={loading} onClick={onClick} type="button">
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
