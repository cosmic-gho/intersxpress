import Link from "next/link";

import {
  ChooseUsSection,
  PartnerStrip,
  ServicesGrid,
  StatsSection,
  TestimonialsSection,
} from "@/components/site-sections";
import { TrackingSearchForm } from "@/components/tracking-search-form";

export default function Home() {
  return (
    <>
      <section
        className="hero-banner"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4, 22, 46, 0.72), rgba(4, 22, 46, 0.72)), url(/assets/img/banner/banner-bg-3.jpg)",
        }}
      >
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Welcome to Inter Express Service</span>
            <h1>Make Faster Delivery in a Quick Solution</h1>
            <p>
              Inter Express Service covers over 150
              destinations all over the globe plus numerous logistics partner
              companies from different areas of the supply chain.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/services">
                Our Services
              </Link>
              <Link className="secondary-button" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          <TrackingSearchForm variant="hero" />
        </div>
      </section>

      <PartnerStrip />

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
                Inter Express Service provides a full
                portfolio of logistic solutions in the United States, including
                international and domestic express delivery, freight forwarding,
                warehousing, packaging, and e-commerce logistics.
              </p>
            </div>
            <ul className="bullet-list">
              <li>24/7 Business Support</li>
              <li>Fast &amp; Secure Deliveries</li>
              <li>Easy &amp; Quick Problem Analysis</li>
              <li>World Wide Most Effective Business</li>
            </ul>
            <Link className="primary-button" href="/about">
              About Us
            </Link>
          </div>
        </div>
      </section>

      <ServicesGrid featuredOnly />
      <ChooseUsSection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
