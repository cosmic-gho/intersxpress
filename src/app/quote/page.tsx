import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";

export default function QuotePage() {
  return (
    <>
      <PageHero title="Quote Request" image="/assets/img/page-bg/page-bg-10.jpg" />
      <section className="section-pad section-soft">
        <div className="shell quote-shell">
          <div className="section-heading centered">
            <h2>Request a Quote</h2>
            <p>
              Recreated from the current project so a visitor can submit the same
              shipping details in the new Next.js frontend.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
