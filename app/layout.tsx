import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "GTSystems - Υπηρεσίες Πληροφορικής και Επιχειρησιακές Λύσεις στην Κέρκυρα",
    template: "%s - GTSystems",
  },
  description:
    "Η GTSystems παρέχει εμπορικές εφαρμογές, ταμειακά και POS συστήματα, τεχνική υποστήριξη, δίκτυα, τηλεπικοινωνίες, ιστοσελίδες και αυτοματισμούς για επιχειρήσεις στην Κέρκυρα και σε όλη την Ελλάδα.",
  openGraph: {
    title: "GTSystems - Υπηρεσίες Πληροφορικής και Επιχειρησιακές Λύσεις",
    description:
      "Ολοκληρωμένες λύσεις πληροφορικής, εμπορικού λογισμικού, υποστήριξης, δικτύων, ιστοσελίδων και αυτοματισμών για σύγχρονες επιχειρήσεις.",
    url: `https://${site.domain}`,
    siteName: site.name,
    images: [{ url: site.socialImage, width: 1640, height: 856 }],
    locale: "el_GR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName,
    url: `https://${site.domain}`,
    image: site.socialImage,
    logo: site.logo,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "GR",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Κέρκυρα",
    },
    foundingDate: site.founded,
    sameAs: [site.facebook, site.linkedin],
    openingHours: "Mo-Fr 09:00-17:00",
  };

  return (
    <html lang="el">
      <body>
        <div className="site-shell">
          <Nav />
          <main className="site-main">{children}</main>
          <Footer />
        </div>

        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
