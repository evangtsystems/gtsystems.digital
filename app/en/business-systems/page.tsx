import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Software & POS Systems",
  description: "Commercial management, accounting, retail, restaurant, cash register, POS, and business automation solutions.",
};

export default function EnglishBusinessSystemsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Business Software</p>
          <h1>Commercial systems, POS, and workflows that fit your operation.</h1>
          <p>
            From daily transactions to reporting and back-office work, GTSystems helps businesses
            run with systems that are properly configured, connected, and supported.
          </p>
        </div>
      </section>
      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Software and automation</h2>
            <p>
              We support commercial management applications for retail, restaurant, accounting, and
              vertical-market needs. The goal is fewer manual steps, cleaner data, and systems your
              team can actually use.
            </p>
            <ul className="check-list">
              <li>Commercial and accounting applications</li>
              <li>Restaurant and retail workflows</li>
              <li>Business intelligence and reporting</li>
              <li>Data sync and operational automation</li>
            </ul>
          </div>
          <aside className="contact-card" id="cash-pos">
            <h2>Cash & POS Systems</h2>
            <p>
              Cash registers, tax registers, POS equipment, weighing-system connections, setup,
              training, and support for reliable front-office operations.
            </p>
            <Link className="button" href="/en/contact">
              Discuss Your Setup
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
