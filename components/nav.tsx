"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const navItems = {
  el: [
    { label: "Αρχική", href: "/" },
    { label: "Λύσεις", href: "/business-systems" },
    { label: "Web & Apps", href: "/web-development" },
    { label: "Υποστήριξη", href: "/web-apps" },
    { label: "Εταιρεία", href: "/company" },
  ],
  en: [
    { label: "Home", href: "/en" },
    { label: "Solutions", href: "/en/business-systems" },
    { label: "Web & Apps", href: "/en/web-development" },
    { label: "Support", href: "/en/web-apps" },
    { label: "Company", href: "/en/company" },
  ],
};

export default function Nav() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const languageHref = isEnglish ? pathname.replace(/^\/en/, "") || "/" : `/en${pathname === "/" ? "" : pathname}`;
  const languageLabel = isEnglish ? "EL" : "EN";
  const contactHref = isEnglish ? "/en/contact" : "/contact";
  const items = isEnglish ? navItems.en : navItems.el;
  const place = isEnglish ? "Corfu, Greece" : `${site.city}, ${site.country}`;
  const hours = isEnglish ? "Mon - Fri: 9.00 - 17.00" : site.hours;

  return (
    <>
      <header className="topbar">
        <div className="container topbar__inner">
          <Link href={isEnglish ? "/en" : "/"} className="brand-link" aria-label={isEnglish ? "GTSystems home" : "Αρχική σελίδα GTSystems"}>
            <Image
              src={site.logoBlack}
              alt="GTSystems I.T. Business Solutions"
              width={300}
              height={82}
              priority
              unoptimized
            />
          </Link>

          <div className="topbar__meta" aria-label={isEnglish ? "Business contact details" : "Στοιχεία επικοινωνίας επιχείρησης"}>
            <span>{place}</span>
            <span>{hours}</span>
            <a href={`tel:${site.phone.replaceAll(" ", "")}`}>
              <strong>{site.phone}</strong>
            </a>
          </div>
        </div>
      </header>

      <nav className="nav" aria-label={isEnglish ? "Primary navigation" : "Κύρια πλοήγηση"}>
        <div className="container nav__inner">
          <div className="nav__links">
            {items.map((item) => (
              <Link
                className={`nav__link${pathname === item.href ? " nav__link--active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav__actions">
            <Link
              className="language-switch"
              href={languageHref}
              aria-label={isEnglish ? "Switch to Greek" : "Switch to English"}
            >
              <span>{languageLabel}</span>
            </Link>
            <Link className="nav__cta" href={contactHref}>
              {isEnglish ? "Contact Us" : "Επικοινωνία"}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
