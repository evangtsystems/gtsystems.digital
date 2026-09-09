import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Επικοινωνήστε με την GTSystems στην Κέρκυρα για υπηρεσίες πληροφορικής, εμπορικό λογισμικό, υποστήριξη, δίκτυα, POS συστήματα και ιστοσελίδες.",
};

export default async function ContactPage({
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
          <p className="eyebrow">Επικοινωνία</p>
          <h1>Πείτε μας τι χρειάζεται να διορθώσετε, να βελτιώσετε ή να δημιουργήσετε.</h1>
          <p>
            Στείλτε μας λίγες πληροφορίες και η GTSystems θα επικοινωνήσει μαζί σας με πρακτικά
            επόμενα βήματα για λογισμικό, υποστήριξη, δίκτυο, POS, ιστοσελίδα ή αυτοματισμό.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2>GTSystems</h2>
            <p>
              {site.address}
              <br />
              {site.hours}
            </p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`tel:${site.mobile.replaceAll(" ", "")}`}>{site.mobile}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>Αρ. ΓΕΜΗ: {site.registryNumber}</p>
          </aside>

          <form className="form-card form-grid" action="/api/contact" method="post">
            {sent ? (
              <div className="contact-card" style={{ padding: 14, borderColor: "#8fa341" }}>
                Ευχαριστούμε. Το αίτημά σας στάλθηκε και η GTSystems θα επικοινωνήσει μαζί σας.
              </div>
            ) : null}
            {error ? (
              <div className="contact-card" style={{ padding: 14, borderColor: "#b54747" }}>
                Συμπληρώστε όνομα, έγκυρο email και ένα σύντομο μήνυμα.
              </div>
            ) : null}
            <input className="field" name="name" placeholder="Ονοματεπώνυμο" required />
            <input className="field" name="company" placeholder="Εταιρεία" />
            <input className="field" name="email" placeholder="Email" type="email" required />
            <input className="field" name="phone" placeholder="Τηλέφωνο" />
            <select className="field" name="topic" defaultValue="">
              <option value="" disabled>
                Τι αφορά το αίτημα;
              </option>
              <option>Εμπορικό λογισμικό</option>
              <option>Ταμειακό ή POS σύστημα</option>
              <option>Τεχνική υποστήριξη</option>
              <option>Δίκτυο ή τηλεπικοινωνίες</option>
              <option>Ιστοσελίδα ή web app</option>
              <option>Άλλο</option>
            </select>
            <textarea className="field" name="message" placeholder="Περιγράψτε σύντομα τι χρειάζεστε" required />
            <button className="button" type="submit">
              Αποστολή αιτήματος
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
