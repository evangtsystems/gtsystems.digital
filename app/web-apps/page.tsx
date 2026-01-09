import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/section";

export const metadata: Metadata = {
  title: "Web Apps",
  description: "Custom web applications: dashboards, portals, admin panels, and internal tools.",
};

export default function WebAppsPage() {
  return (
    <>
      <section style={{ padding: "54px 16px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Custom Web Applications</h1>
          <p style={{ margin: "12px 0 0", maxWidth: 860, color: "rgba(245,245,245,0.85)", fontSize: 18, lineHeight: 1.7 }}>
            When a website isn’t enough, we build systems: dashboards, portals, admin panels and tools that save time.
          </p>
        </div>
      </section>

      <Section eyebrow="Use cases" title="Built for real workflows">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Admin dashboards & reporting</li>
          <li>Client portals & self-service</li>
          <li>Booking/ordering flows</li>
          <li>Internal tools & automation</li>
        </ul>

        <div style={{ marginTop: 18 }}>
          <Link href="/contact" style={{ textDecoration: "none", fontWeight: 900, color: "#d1b76e" }}>
            Tell us what you need →
          </Link>
        </div>
      </Section>
    </>
  );
}
