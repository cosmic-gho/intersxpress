import Link from "next/link";
import {
  CalendarDays,
  Globe2,
  House,
  Mail,
  MapPin,
  MessageCircleMore,
  Package,
  Phone,
  Plane,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

import {
  allServices,
  chooseUsItems,
  companyInfo,
  counters,
  partnerLogos,
  testimonials,
} from "@/lib/site-data";

function iconForChooseUs(icon: string) {
  switch (icon) {
    case "calendar":
      return <CalendarDays size={22} />;
    case "globe":
      return <Globe2 size={22} />;
    case "users":
      return <Users size={22} />;
    default:
      return <Truck size={22} />;
  }
}

const contactCards = [
  {
    icon: <Mail size={26} />,
    title: "Email Us:",
    content: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
  },
  {
    icon: <Phone size={26} />,
    title: "Call Us:",
    content: "Tel. +17343834919",
    href: `tel:${companyInfo.phone}`,
  },
  {
    icon: <MapPin size={26} />,
    title: "London",
    content: companyInfo.address,
    href: "#",
  },
  {
    icon: <MessageCircleMore size={26} />,
    title: "Live Chat",
    content: "Live chat all the time with our company 24/7",
    href: "#",
  },
];

export function PartnerStrip() {
  return (
    <section className="partner-strip">
      <div className="shell">
        <div className="partner-row">
          {partnerLogos.map((logo) => (
            <div key={logo} className="partner-card">
              <img src={logo} alt="Partner logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const services = featuredOnly ? allServices.slice(0, 3) : allServices;
  const icons = [Truck, Package, Plane, ShieldCheck, House, Globe2];

  return (
    <section className="section-pad section-soft">
      <div className="shell">
        <div className="section-heading centered">
          <span>Our Services</span>
          <h2>We are Trusted for Our Services</h2>
          <p>
            Our unique, asset-light business model lets Inter Express Service adapt quickly,
            execute last-mile delivery solutions, and respond to changing customer
            preferences.
          </p>
        </div>
        <div className="card-grid three-up">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Truck;

            return (
              <article key={service.title} className="service-card">
                <img className="service-image" src={service.image} alt={service.title} />
                <div className="service-body">
                  <div className="service-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link href={service.href}>Read More</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ChooseUsSection() {
  return (
    <section className="section-pad">
      <div className="shell split-layout">
        <div>
          <div className="section-heading">
            <span>Why Choose Inter Express Service</span>
            <h2>We Are The Best And That&apos;s Why You Can Choose Us Easily</h2>
            <p>
              We believe a connected world is a better world. That belief guides
              everything we do, from customer communication to secure and reliable
              delivery operations.
            </p>
          </div>
          <div className="mini-grid">
            {chooseUsItems.map((item, index) => (
              <div key={`${item.text}-${index}`} className={`choice-card choice-${index % 2}`}>
                {iconForChooseUs(item.icon)}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="image-frame">
          <img src="/assets/img/choose-us-img-3.jpg" alt="Why choose us" />
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="stats-strip">
      <div className="shell card-grid four-up">
        {counters.map((counter) => (
          <div key={counter.label} className="stat-card">
            <strong>{counter.value}</strong>
            <span>{counter.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-pad">
      <div className="shell">
        <div className="section-heading centered">
          <span>Our Clients</span>
          <h2>Let&apos;s Know About All Of Our Client Says</h2>
          <p>
            We value what our clients have to say about us and hope you do as well.
            Below are generous testimonials from past and present clients.
          </p>
        </div>
        <div className="card-grid three-up">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <h3>{testimonial.name}</h3>
              <span>{testimonial.role}</span>
              <p>{testimonial.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCards() {
  return (
    <section className="section-soft section-pad">
      <div className="shell card-grid four-up">
        {contactCards.map((card) => (
          <a key={card.title} className="contact-card" href={card.href}>
            <div className="contact-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
