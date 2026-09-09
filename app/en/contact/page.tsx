import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact GTSystems in Corfu for IT services, business software, support, networks, POS systems, and websites.",
};

export default async function EnglishContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const sent = params?.sent === "1";
  const error = params?.error === "1";

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Tell us what you need to fix, improve, or build.</h1>
          <p>
            Share a few details and GTSystems will follow up with practical next steps for your
            software, support, network, POS, website, or automation need.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2>GTSystems</h2>
            <p>
              Corfu, Greece
              <br />
              Mon - Fri: 9.00 - 17.00
            </p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`tel:${site.mobile.replaceAll(" ", "")}`}>{site.mobile}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>Business Registry No: {site.registryNumber}</p>
          </aside>

          <form className="form-card form-grid" action="/api/contact" method="post">
            <input type="hidden" name="locale" value="en" />
            {sent ? (
              <div className="contact-card" style={{ padding: 14, borderColor: "#8fa341" }}>
                Thank you. Your request was sent and GTSystems will follow up.
              </div>
            ) : null}
            {error ? (
              <div className="contact-card" style={{ padding: 14, borderColor: "#b54747" }}>
                Please add your name, a valid email, and a short message.
              </div>
            ) : null}
            <input className="field" name="name" placeholder="Name" required />
            <input className="field" name="company" placeholder="Company" />
            <input className="field" name="email" placeholder="Email" type="email" required />
            <input className="field" name="phone" placeholder="Phone" />
            <select className="field" name="topic" defaultValue="">
              <option value="" disabled>
                What is this about?
              </option>
              <option>Business software</option>
              <option>Cash or POS system</option>
              <option>IT support</option>
              <option>Network or telecoms</option>
              <option>Website or web app</option>
              <option>Other</option>
            </select>
            <textarea className="field" name="message" placeholder="Briefly describe what you need" required />
            <button className="button" type="submit">
              Send Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
