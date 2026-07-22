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
  title: "Inter Express Service | Logistics & Transportation Company",
  description: "Inter Express Service logistics and transportation website.",
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
