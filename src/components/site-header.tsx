"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Menu, PackageSearch, Phone, X } from "lucide-react";
import { useState } from "react";

import { companyInfo, navItems } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="shell topbar-inner">
          <div className="topbar-group">
            <span className="topbar-item">
              <MapPin size={16} />
              {companyInfo.address}
            </span>
            <a className="topbar-item" href={`mailto:${companyInfo.email}`}>
              <Mail size={16} />
              {companyInfo.email}
            </a>
          </div>
          <a className="topbar-item topbar-phone" href={`tel:${companyInfo.phone}`}>
            <Phone size={16} />
            {companyInfo.phone}
          </a>
        </div>
      </div>

      <div className="navbar-shell shell">
        <Link className="brand-mark" href="/">
          <img src="/assets/img/logo-inter.jpeg" alt="Inter Express Service" />
        </Link>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="menu-toggle"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="track-button mobile-only" href="/track" onClick={() => setOpen(false)}>
            <PackageSearch size={18} />
            Track Shipments
          </Link>
        
        </nav>

        <div className="desktop-only" style={{ display: "flex", gap: "0.75rem" }}>
          
          <Link className="track-button" href="/track">
            <PackageSearch size={18} />
            Track Shipments
          </Link>
        </div>
      </div>
    </header>
  );
}
