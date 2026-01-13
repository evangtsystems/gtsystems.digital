import Link from "next/link";

export default function Footer() {


  function FooterExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={footerLinkExternal}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

const footerLinkExternal: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  marginBottom: 8,
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
};

  return (
    <footer
      style={{
        background: "#000",
        color: "#fff",
        borderTop: "6px solid #8da03f",
        padding: "48px 16px 0",
      }}
    >
      {/* TOP GRID */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}
      >
        {/* LOGO + PARTNERS */}
        <div>
         <div>
  <img
    src="https://gtsystems.gr/gtswh.gif"
    alt="GT Systems"
    style={{
      width: 220,
      height: "auto",
      objectFit: "contain",
      display: "block",
    }}
  />
</div>


          <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
            <span style={badge}>AnyDesk</span>
            <span style={badge}>Bitdefender</span>
          </div>
        </div>

        {/* CATEGORIES */}
        {/* CATEGORIES */}
<div>
  <FooterTitle>Categories</FooterTitle>

  <FooterLink href="/kataskevi-istoselidon-kerkyra">
    Κατασκευή Ιστοσελίδων Κέρκυρα
  </FooterLink>

  <FooterExternalLink href="https://gtsystems.gr/company/">
    Company
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/">
    Services
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/contact-us/">
    Contact Us
  </FooterExternalLink>
</div>



        {/* SERVICES */}
        <div>
  <FooterTitle>Services</FooterTitle>

  <FooterExternalLink href="https://gtsystems.gr/services/commercial-management/">
    Commercial Management
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/cash-systems/">
    Cash Systems
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/support-services/">
    Support Services
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/telecommunications-centers/">
    Telecommunications Centers
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/network-wi-fi/">
    Network &amp; Wi-Fi
  </FooterExternalLink>

  <FooterExternalLink href="https://gtsystems.gr/services/websites/">
    Websites
  </FooterExternalLink>
</div>


        {/* CONTACT */}
        <div>
          <FooterTitle>Contact Us</FooterTitle>
          <FooterItem>📍 Corfu, Greece</FooterItem>
          <FooterItem>
            📞{" "}
            <a href="tel:+302661700610" style={plainLink}>
              +30 26617 00610
            </a>
          </FooterItem>
          <FooterItem>
            📱{" "}
            <a href="tel:+306945971968" style={plainLink}>
              +30 6945 971968
            </a>
          </FooterItem>
          <FooterItem>
            ✉{" "}
            <a href="mailto:info@gtsystems.gr" style={plainLink}>
              info@gtsystems.gr
            </a>
          </FooterItem>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          marginTop: 48,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div>GTSystems I.T. Business Solutions © {new Date().getFullYear()}</div>

          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="https://www.facebook.com/gtsystemsgr"
              target="_blank"
              rel="noopener noreferrer"
              style={social}
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://www.linkedin.com/company/gtsystems/"
              target="_blank"
              rel="noopener noreferrer"
              style={social}
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontWeight: 700,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: "2px solid #8da03f",
        width: "fit-content",
      }}
    >
      {children}
    </div>
  );
}

function FooterItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, marginBottom: 8, color: "rgba(255,255,255,0.85)" }}>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        fontSize: 14,
        marginBottom: 8,
        color: "rgba(255,255,255,0.85)",
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

const badge: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 6,
  fontSize: 12,
};

const social: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "#fff",
  color: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontWeight: 800,
};

const plainLink: React.CSSProperties = {
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
};
