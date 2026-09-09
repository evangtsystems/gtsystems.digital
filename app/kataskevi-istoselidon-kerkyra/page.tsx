import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Κατασκευή Ιστοσελίδων στην Κέρκυρα",
  description:
    "Κατασκευή επαγγελματικών ιστοσελίδων στην Κέρκυρα από την GTSystems, με τοπική υποστήριξη, SEO, web apps και σύνδεση με επιχειρησιακές διαδικασίες.",
};

export default function WebDevelopmentCorfuPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">GTSystems Κέρκυρα</p>
          <h1>Κατασκευή ιστοσελίδων στην Κέρκυρα για επαγγελματίες και επιχειρήσεις.</h1>
          <p>
            Σχεδιάζουμε γρήγορες, σύγχρονες ιστοσελίδες που βοηθούν την επιχείρησή σας να
            παρουσιάζεται σωστά, να βρίσκει νέους πελάτες και να συνδέεται με τα καθημερινά σας
            συστήματα.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Τοπική ομάδα, πρακτική τεχνογνωσία</h2>
            <p>
              Η GTSystems βρίσκεται στην Κέρκυρα και γνωρίζει τις ανάγκες των τοπικών επιχειρήσεων:
              τουρισμός, εστίαση, λιανική, υπηρεσίες, γραφεία και επαγγελματίες. Η ιστοσελίδα δεν
              πρέπει απλώς να φαίνεται όμορφη. Πρέπει να φέρνει εμπιστοσύνη, αιτήματα και καλύτερη
              οργάνωση.
            </p>
            <ul className="check-list">
              <li>Επαγγελματική παρουσίαση υπηρεσιών και προϊόντων</li>
              <li>Δομή φιλική για Google και τοπικό SEO</li>
              <li>Responsive σχεδίαση για κινητά και tablets</li>
              <li>Φόρμες επικοινωνίας, αιτήματα και βασικές αυτοματοποιήσεις</li>
              <li>Υποστήριξη από ομάδα που βρίσκεται δίπλα σας</li>
            </ul>
          </div>

          <aside className="contact-card">
            <h2>Μιλήστε μαζί μας</h2>
            <p>
              Αν αναζητάτε κατασκευή ιστοσελίδας στην Κέρκυρα, επικοινωνήστε με την GTSystems για
              μια σύντομη συζήτηση χωρίς υποχρέωση.
            </p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <Link className="button" href="/contact">
              Επικοινωνία
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
