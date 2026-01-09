import Link from "next/link";

const linkStyle: React.CSSProperties = {
  color: "#f5f5f5",
  textDecoration: "none",
  fontWeight: 700,
  padding: "10px 12px",
  borderRadius: 12,
};

export default function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(7, 8, 21, 0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(209, 183, 110, 0.18)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link href="/" style={{ ...linkStyle, padding: 0, fontSize: 16 }}>
          <span style={{ color: "#d1b76e" }}>GTSystems</span> Digital
        </Link>

        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link href="/web-development" style={linkStyle}>
            Web Development
          </Link>
          <Link href="/web-apps" style={linkStyle}>
            Web Apps
          </Link>
          <Link href="/business-systems" style={linkStyle}>
            Business Systems
          </Link>
          <Link
            href="/contact"
            style={{
              ...linkStyle,
              background: "linear-gradient(180deg, rgba(209,183,110,0.95), rgba(209,183,110,0.75))",
              color: "#070815",
            }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
