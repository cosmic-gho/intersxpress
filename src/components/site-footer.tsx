import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

import { allServices, companyInfo } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="footer-wrap">
      <div className="shell footer-grid">
        <div className="footer-card">
          <Link className="footer-logo" href="/">
            <img src="/assets/img/logo-inter.jepg" alt="Inter Express Service" />
          </Link>
          <p>
            Inter Express Service is a trusted logistics company. Our teams help you
            cross borders, reach new markets, and grow your business every day.
          </p>
          <div className="footer-socials">
            <a aria-label="Facebook" href="#">
              <Facebook size={18} />
            </a>
            <a aria-label="Instagram" href="#">
              <Instagram size={18} />
            </a>
            <a aria-label="LinkedIn" href="#">
              <Linkedin size={18} />
            </a>
            <a aria-label="Twitter" href="#">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className="footer-card">
          <h3>Services</h3>
          <ul className="footer-links">
            {allServices.map((service) => (
              <li key={service.title}>
                <Link href={service.href}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-card">
          <h3>Company</h3>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/quote">Request a Quote</Link>
            </li>
          </ul>
        </div>

        <div className="footer-card">
          <h3>Address</h3>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={18} />
              <span>{companyInfo.address}</span>
            </li>
            <li>
              <Mail size={18} />
              <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright-bar">
        <div className="shell">
          <p>@Copyright 2022 Inter Express Service - Logistics &amp; Transportation Company | All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
