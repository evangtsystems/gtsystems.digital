import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Company",
  description: "GTSystems is a Corfu-based IT business solutions company established in 2005.",
};

export default function EnglishCompanyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About GTSystems</p>
          <h1>Local expertise, integrated business technology.</h1>
          <p>
            Since {site.founded}, GTSystems has helped companies choose, install, connect, and
            support the systems they depend on every day.
          </p>
        </div>
      </section>
      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>What we stand for</h2>
            <p>
              We work with businesses that need practical technology decisions, not generic advice.
              That means understanding operations, configuring systems around real requirements,
              and staying available when support is needed.
            </p>
            <p>
              Our work spans commercial software, cash and POS systems, computer service, networks,
              telecoms, websites, web apps, and business process automation.
            </p>
            <div className="section-actions">
              <Link className="button" href="/en/contact">
                Start a Conversation
              </Link>
            </div>
          </div>
          <aside className="contact-card">
            <h2>Company Details</h2>
            <p>
              <strong>{site.legalName}</strong>
              <br />
              Corfu, Greece
              <br />
              Business Registry No: {site.registryNumber}
            </p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
