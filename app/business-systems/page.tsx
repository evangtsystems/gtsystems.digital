import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/section";

export const metadata: Metadata = {
  title: "Business Systems",
  description: "Business systems, automation, and integrations informed by ERP and accounting reality.",
};

export default function BusinessSystemsPage() {
  return (
    <>
      <section style={{ padding: "54px 16px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Business Systems & Automation</h1>
          <p style={{ margin: "12px 0 0", maxWidth: 860, color: "rgba(245,245,245,0.85)", fontSize: 18, lineHeight: 1.7 }}>
            We don’t just “build websites”. We connect tools and automate workflows — the stuff that actually moves revenue.
          </p>
        </div>
      </section>

      <Section eyebrow="Focus" title="What we help automate">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Process automation and integrations</li>
          <li>Data sync between systems</li>
          <li>Back-office dashboards & reporting</li>
          <li>ERP-adjacent workflows (where allowed/possible)</li>
        </ul>

        <div style={{ marginTop: 18 }}>
          <Link
            href="/contact"
            style={{
              textDecoration: "none",
              fontWeight: 900,
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(209,183,110,0.35)",
              color: "#f5f5f5",
            }}
          >
            Discuss a system project
          </Link>
        </div>
      </Section>
    </>
  );
}
