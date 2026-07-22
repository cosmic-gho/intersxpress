import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { ContactCards } from "@/components/site-sections";

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" image="/assets/img/page-bg/page-bg-5.jpg" />
      <ContactCards />

      <section className="section-pad">
        <div className="shell contact-shell">
          <div className="section-heading centered">
            <h2>Drop Us A Message For Any Query</h2>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="map-wrap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.1935827502225!2d-88.54223508432493!3d41.586694691578195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880ebf5c2925d401%3A0x82b679cd7569709f!2s9170%20Millbrook%20Rd%2C%20Newark%2C%20IL%2060541%2C%20USA!5e0!3m2!1sen!2sbd!4v1601810027362!5m2!1sen!2sbd"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Inter Express Service office map"
        />
      </section>
    </>
  );
}
