import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/section";

export const metadata: Metadata = {
  title: "Web Development",
  description: "Web development for businesses: fast SSR sites, SEO-ready structure, and conversion-focused pages.",
};

export default function WebDevelopmentPage() {
  return (
    <>
      <section style={{ padding: "54px 16px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Web Development for Businesses</h1>
          <p style={{ margin: "12px 0 0", maxWidth: 860, color: "rgba(245,245,245,0.85)", fontSize: 18, lineHeight: 1.7 }}>
            SSR-first websites built for speed, SEO, and results — leads, bookings, and credibility.
          </p>
        </div>
      </section>

      <Section eyebrow="Deliverables" title="What you get">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Modern SSR website (Next.js) with clean, indexable pages</li>
          <li>Mobile-first design and performance-first build</li>
          <li>SEO foundations: metadata, structured content, internal linking</li>
          <li>Analytics + conversion tracking (optional)</li>
        </ul>

        <div style={{ marginTop: 18 }}>
          <Link
            href="/contact"
            style={{
              textDecoration: "none",
              fontWeight: 900,
              padding: "12px 16px",
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(209,183,110,0.95), rgba(209,183,110,0.75))",
              color: "#070815",
            }}
          >
            Request a Quote
          </Link>
        </div>
      </Section>
    </>
  );
}
