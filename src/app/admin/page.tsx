import { PageHero } from "@/components/page-hero";
import { SignOutButton } from "@/components/sign-out-button";
import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdminIdentity } from "@/lib/supabase/admin-auth";
import { getAdminContactMessages, getAdminShipments } from "@/lib/supabase/dashboard";
import { getSupabaseServiceRoleEnv } from "@/lib/supabase/env";

export default async function AdminPage() {
  const admin = await requireAdminIdentity();

  if (!getSupabaseServiceRoleEnv()) {
    return (
      <>
        <PageHero title="Admin Dashboard" image="/assets/img/page-bg/page-bg-4.jpg" />
        <section className="track-page-surface">
          <div className="shell">
            <div className="tracking-search-card">
              <div className="form-title">
                <h3>Service role key missing</h3>
                <p>Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` to enable admin dashboard access.</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const [shipments, contactMessages] = await Promise.all([
    getAdminShipments(),
    getAdminContactMessages(),
  ]);

  return (
    <>
      <PageHero title="Admin Dashboard" image="/assets/img/page-bg/page-bg-4.jpg" />
      <div className="shell" style={{ paddingTop: "2rem" }}>
        <SignOutButton />
      </div>
      <AdminDashboard
        admin={admin}
        initialContactMessages={contactMessages}
        initialShipments={shipments}
      />
    </>
  );
}
