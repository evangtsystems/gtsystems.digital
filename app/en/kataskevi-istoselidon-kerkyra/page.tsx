import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Web Development in Corfu",
  description: "Professional website development in Corfu by GTSystems, with local support, SEO, web apps, and business process integration.",
};

export default function EnglishCorfuWebDevelopmentPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">GTSystems Corfu</p>
          <h1>Website development in Corfu for professionals and businesses.</h1>
          <p>
            We design fast, modern websites that help your business present itself clearly, find
            new customers, and connect with your everyday systems.
          </p>
        </div>
      </section>
      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Local team, practical know-how</h2>
            <p>
              GTSystems is based in Corfu and understands local business needs across tourism,
              hospitality, retail, services, offices, and independent professionals.
            </p>
            <ul className="check-list">
              <li>Professional presentation of services and products</li>
              <li>Google-friendly structure and local SEO</li>
              <li>Responsive design for mobile and tablets</li>
              <li>Contact forms, requests, and basic automations</li>
              <li>Support from a team close to your business</li>
            </ul>
          </div>
          <aside className="contact-card">
            <h2>Talk to us</h2>
            <p>Contact GTSystems for a short, no-obligation discussion about your website.</p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <Link className="button" href="/en/contact">
              Contact
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
