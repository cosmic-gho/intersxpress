import Link from "next/link";

import {
  ChooseUsSection,
  PartnerStrip,
  StatsSection,
} from "@/components/site-sections";
import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" image="/assets/img/page-bg/page-bg-1.jpg" />

      <section className="section-pad">
        <div className="shell split-layout">
          <div className="image-stack">
            <img src="/assets/img/about-img-3.png" alt="About Inter Express Service" />
            <div className="experience-tag">13 Years of Experience</div>
          </div>
          <div>
            <div className="section-heading">
              <span>About Us</span>
              <h2>Modern, Secured &amp; Trusted Logistics Company</h2>
              <p>
                Inter Express Service provides a
                portfolio of full logistic solutions in the United States,
                including international and domestic express delivery, freight
                forwarding, warehousing, packaging services, food delivery,
                agriculture logistics, and e-commerce solutions.
              </p>
            </div>
            <ul className="bullet-list">
              <li>24/7 Business Support</li>
              <li>Fast &amp; Secure Deliveries</li>
              <li>Easy &amp; Quick Problem Analysis</li>
              <li>World Wide Most Effective Business</li>
            </ul>
            <Link className="primary-button" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <StatsSection />
      <ChooseUsSection />
      <PartnerStrip />
    </>
  );
}
