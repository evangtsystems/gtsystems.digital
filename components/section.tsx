export default function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "46px 16px",
        borderTop: "1px solid rgba(209, 183, 110, 0.14)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {eyebrow ? (
          <div style={{ color: "#d1b76e", fontWeight: 800, letterSpacing: 0.3, marginBottom: 10 }}>
            {eyebrow}
          </div>
        ) : null}

        <h2 style={{ margin: 0, fontSize: 30, lineHeight: 1.15, color: "#f5f5f5" }}>{title}</h2>
        <div style={{ marginTop: 14, color: "rgba(245,245,245,0.86)", fontSize: 16, lineHeight: 1.65 }}>
          {children}
        </div>
      </div>
    </section>
  );
}
