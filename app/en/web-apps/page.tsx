import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IT Support Services",
  description: "Computer and laptop service, support contracts, remote support, hardware supply, and business IT assistance.",
};

export default function EnglishSupportPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Support Services</p>
          <h1>Practical IT support for the systems your team uses every day.</h1>
          <p>
            GTSystems supports computers, laptops, software, networks, and connected business tools
            so your team can keep working with less downtime and clearer responsibility.
          </p>
        </div>
      </section>
      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Support that understands business context</h2>
            <p>
              Good support is not only fixing a device. It is understanding what the device,
              software, network, and user are trying to accomplish together.
            </p>
            <ul className="check-list">
              <li>Support contracts and scheduled maintenance</li>
              <li>Computer and laptop service</li>
              <li>Hardware sales and setup</li>
              <li>Remote assistance and troubleshooting</li>
              <li>Security and reliability improvements</li>
            </ul>
          </div>
          <aside className="contact-card">
            <h2>Need help now?</h2>
            <p>Contact GTSystems with the system, device, or workflow that is blocking your team.</p>
            <Link className="button" href="/en/contact">
              Request Support
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
