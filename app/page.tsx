import Link from "next/link";
import Section from "@/components/section";

export default function HomePage() {
  return (
    <>
      <section style={{ padding: "64px 16px 46px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ color: "#d1b76e", fontWeight: 900, letterSpacing: 0.3 }}>
            Digital Agency • Web Development • Business Systems
          </div>

          <h1 style={{ margin: "12px 0 0", fontSize: 48, lineHeight: 1.05 }}>
            Websites that run businesses — not just look good.
          </h1>

          <p style={{ margin: "14px 0 0", maxWidth: 760, color: "rgba(245,245,245,0.85)", fontSize: 18, lineHeight: 1.7 }}>
            We build fast, SEO-ready websites, custom web apps, and business systems that help SMEs grow.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
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
              Get a Quote
            </Link>

            <Link
              href="/web-development"
              style={{
                textDecoration: "none",
                fontWeight: 900,
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(209,183,110,0.35)",
                color: "#f5f5f5",
              }}
            >
              Web Development
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="What we do" title="A digital partner for business growth">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 14 }}>
          {[
            { t: "Business Websites", d: "Fast SSR sites focused on leads, bookings, and trust." },
            { t: "Web Apps", d: "Dashboards, portals, admin panels — built for real workflows." },
            { t: "Business Systems", d: "Automation, integrations, and system thinking from ERP world." },
            { t: "Long-term Support", d: "We don’t disappear after launch. We iterate and improve." },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(209,183,110,0.18)",
                background: "rgba(7, 8, 21, 0.55)",
              }}
            >
              <div style={{ fontWeight: 900, color: "#f5f5f5" }}>{x.t}</div>
              <div style={{ marginTop: 8, color: "rgba(245,245,245,0.82)" }}>{x.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Next step" title="Tell us what you want to build">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <Link
            href="/contact"
            style={{
              textDecoration: "none",
              fontWeight: 900,
              padding: "12px 16px",
              borderRadius: 14,
              background: "rgba(245,245,245,0.08)",
              border: "1px solid rgba(209,183,110,0.25)",
              color: "#f5f5f5",
            }}
          >
            Contact
          </Link>
          <Link href="/web-apps" style={{ textDecoration: "none", fontWeight: 900, color: "#d1b76e" }}>
            Explore Web Apps →
          </Link>
        </div>
      </Section>
    </>
  );
}
