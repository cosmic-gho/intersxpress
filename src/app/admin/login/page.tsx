import { AuthForm } from "@/components/auth-form";
import { PageHero } from "@/components/page-hero";

export default function AdminLoginPage() {
  return (
    <>
      <PageHero title="Admin Login" image="/assets/img/page-bg/page-bg-5.jpg" />
      <AuthForm mode="login" redirectTo="/admin" variant="admin" />
    </>
  );
}
