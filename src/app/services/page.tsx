import { PageHero } from "@/components/page-hero";
import { ServicesGrid } from "@/components/site-sections";

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" image="/assets/img/page-bg/page-bg-6.jpg" />
      <ServicesGrid />
    </>
  );
}
