"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { partnerLinks, services, site } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const serviceLinks = isEnglish
    ? [
        { title: "Business Software", href: "/en/business-systems" },
        { title: "Cash & POS Systems", href: "/en/business-systems#cash-pos" },
        { title: "IT Support", href: "/en/web-apps" },
        { title: "Networks & Infrastructure", href: "/en/web-development" },
        { title: "Websites & Web Apps", href: "/en/web-development" },
      ]
    : services.slice(0, 5);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Image src={site.logoWhite} alt="GTSystems" width={300} height={82} unoptimized />
          <p>
            {isEnglish
              ? "Integrated IT, software, infrastructure, support, and digital solutions for businesses that need dependable local expertise."
              : "Ολοκληρωμένες λύσεις πληροφορικής, λογισμικού, υποδομών, υποστήριξης και digital υπηρεσιών για επιχειρήσεις που χρειάζονται αξιόπιστη τοπική τεχνογνωσία."}
          </p>
        </div>

        <div>
          <h3>{isEnglish ? "Company" : "Εταιρεία"}</h3>
          <Link href={isEnglish ? "/en/company" : "/company"}>
            {isEnglish ? "About GTSystems" : "Σχετικά με την GTSystems"}
          </Link>
          <Link href={isEnglish ? "/en/business-systems" : "/business-systems"}>
            {isEnglish ? "Solutions" : "Λύσεις"}
          </Link>
          <Link href={isEnglish ? "/en/contact" : "/contact"}>
            {isEnglish ? "Contact Us" : "Επικοινωνία"}
          </Link>
        </div>

        <div>
          <h3>{isEnglish ? "Services" : "Υπηρεσίες"}</h3>
          {serviceLinks.map((service) => (
            <Link href={service.href} key={service.title}>
              {service.title}
            </Link>
          ))}
        </div>

        <div>
          <h3>{isEnglish ? "Contact" : "Επικοινωνία"}</h3>
          <p>
            {site.address}
            <br />
            <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
            <a href={`tel:${site.mobile.replaceAll(" ", "")}`}>{site.mobile}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          {partnerLinks.map((partner) => (
            <a href={partner.href} key={partner.label} target="_blank" rel="noopener noreferrer">
              {partner.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          {site.legalName} © {new Date().getFullYear()} ·{" "}
          {isEnglish ? "Business Registry No:" : "Αρ. ΓΕΜΗ:"} {site.registryNumber}
        </div>
      </div>
    </footer>
  );
}
