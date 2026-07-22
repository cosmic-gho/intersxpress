import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type AdminIdentity = {
  email: string | null;
  fullName: string | null;
  id: string;
};

export async function getAdminIdentity() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return null;
  }

  return {
    email: user.email ?? null,
    fullName: profile.full_name ?? null,
    id: user.id,
  } satisfies AdminIdentity;
}

export async function requireAdminIdentity() {
  const admin = await getAdminIdentity();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
