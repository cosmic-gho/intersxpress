import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.interexpressservice.site"),
  title: {
    default: "Inter Express Service | Worldwide Shipping Solutions",
    template: "%s | Inter Express Service",
  },
  description:
    "Inter Express Service provides worldwide shipping solutions, package tracking, freight forwarding, secure deliveries, and logistics support for domestic and international shipments.",
  keywords: [
    "Inter Express Service",
    "worldwide shipping",
    "logistics company",
    "courier service",
    "package tracking",
    "freight forwarding",
    "international delivery",
    "domestic shipping",
    "shipment tracking",
  ],
  applicationName: "Inter Express Service",
  category: "business",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.interexpressservice.site",
    siteName: "Inter Express Service",
    title: "Inter Express Service | Worldwide Shipping Solutions",
    description:
      "Worldwide shipping solutions with secure logistics support, parcel tracking, freight services, and international delivery management.",
    images: [
      {
        url: "/assets/img/logo-inter.jpeg",
        width: 1024,
        height: 683,
        alt: "Inter Express Service logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inter Express Service | Worldwide Shipping Solutions",
    description:
      "Track shipments, manage deliveries, and access worldwide logistics support with Inter Express Service.",
    images: ["/assets/img/logo-inter.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/assets/img/favicon.png",
    shortcut: "/assets/img/favicon.png",
    apple: "/assets/img/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable}`}
    >
      <body>
        <Script id="smartsupp-live-chat" strategy="afterInteractive">
          {`
            var _smartsupp = window._smartsupp || {};
            _smartsupp.key = '7282afd7c33c53b0af6f2a185cd794514ad270c1';
            window._smartsupp = _smartsupp;
            window.smartsupp || (function(d) {
              var s, c, o = window.smartsupp = function() { o._.push(arguments); };
              o._ = [];
              s = d.getElementsByTagName('script')[0];
              c = d.createElement('script');
              c.type = 'text/javascript';
              c.charset = 'utf-8';
              c.async = true;
              c.src = 'https://www.smartsuppchat.com/loader.js?';
              s.parentNode.insertBefore(c, s);
            })(document);
          `}
        </Script>
        <noscript>
          Powered by{" "}
          <a href="https://www.smartsupp.com" rel="noreferrer" target="_blank">
            Smartsupp
          </a>
        </noscript>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
