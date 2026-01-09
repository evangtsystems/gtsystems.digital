export default function ContactPage() {
  return (
    <section style={{ padding: "54px 16px 60px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Contact</h1>
        <p style={{ margin: "12px 0 0", color: "rgba(245,245,245,0.85)", fontSize: 18, lineHeight: 1.7 }}>
          Tell us what you want to build. We’ll respond with next steps and an estimate.
        </p>

        <form
          action="/api/contact"
          method="post"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 12,
            padding: 16,
            borderRadius: 16,
            border: "1px solid rgba(209,183,110,0.18)",
            background: "rgba(7, 8, 21, 0.55)",
          }}
        >
          <input name="name" placeholder="Name" required style={inputStyle} />
          <input name="company" placeholder="Company (optional)" style={inputStyle} />
          <input name="email" placeholder="Email" type="email" required style={inputStyle} />
          <input name="phone" placeholder="Phone (optional)" style={inputStyle} />
          <textarea name="message" placeholder="What do you need?" required rows={6} style={inputStyle} />

          <button
            type="submit"
            style={{
              cursor: "pointer",
              fontWeight: 900,
              padding: "12px 16px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(180deg, rgba(209,183,110,0.95), rgba(209,183,110,0.75))",
              color: "#070815",
            }}
          >
            Send
          </button>

          <div style={{ color: "rgba(245,245,245,0.65)", fontSize: 13 }}>
            This form posts to a Next.js Node route: <code>/api/contact</code>.
          </div>
        </form>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(245,245,245,0.14)",
  background: "rgba(0,0,0,0.25)",
  color: "#f5f5f5",
  outline: "none",
};
