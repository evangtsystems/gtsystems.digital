import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { providers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Εμπορικό Λογισμικό & POS Συστήματα",
  description:
    "Λύσεις εμπορικής διαχείρισης, λογιστικής, λιανικής, εστίασης, ταμειακών, POS και επιχειρησιακών αυτοματισμών.",
};

export default function BusinessSystemsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Εμπορικό Λογισμικό</p>
          <h1>Εμπορικά συστήματα, POS και ροές εργασίας που ταιριάζουν στη λειτουργία σας.</h1>
          <p>
            Από τις καθημερινές συναλλαγές έως το reporting και το back-office, η GTSystems βοηθά
            τις επιχειρήσεις να λειτουργούν με συστήματα σωστά ρυθμισμένα, συνδεδεμένα και
            υποστηριζόμενα.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Λογισμικό και αυτοματισμοί</h2>
            <p>
              Υποστηρίζουμε εφαρμογές εμπορικής διαχείρισης για λιανική, εστίαση, λογιστική και
              ειδικές ανάγκες κάθε κλάδου. Ο στόχος είναι απλός: λιγότερα χειροκίνητα βήματα,
              καθαρότερα δεδομένα και συστήματα που η ομάδα σας μπορεί πραγματικά να χρησιμοποιεί.
            </p>
            <ul className="check-list">
              <li>Εμπορικές και λογιστικές εφαρμογές</li>
              <li>Ροές εργασίας για εστίαση και λιανική</li>
              <li>Επιχειρησιακή πληροφόρηση και reporting</li>
              <li>Συγχρονισμός δεδομένων και λειτουργικοί αυτοματισμοί</li>
            </ul>
          </div>

          <aside className="contact-card" id="cash-pos">
            <h2>Ταμειακά & POS Συστήματα</h2>
            <p>
              Ταμειακές μηχανές, φορολογικοί μηχανισμοί, POS εξοπλισμός, συνδέσεις με ζυγιστικά,
              εγκατάσταση, εκπαίδευση και υποστήριξη για επιχειρήσεις που χρειάζονται αξιόπιστη
              καθημερινή λειτουργία.
            </p>
            <Link className="button" href="/contact">
              Συζητήστε τη λύση σας
            </Link>
          </aside>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Πλατφόρμες</p>
              <h2>Megasoft, RBS και λύσεις POS με τεχνική ευθύνη από την GTSystems.</h2>
            </div>
            <p>
              Επιλέγουμε και υποστηρίζουμε εργαλεία που αντέχουν στην καθημερινή χρήση: πωλήσεις,
              αποθήκη, ταμείο, εστίαση, reporting, ασφάλεια και απομακρυσμένη βοήθεια.
            </p>
          </div>

          <div className="provider-grid provider-grid--compact">
            {providers.slice(0, 4).map((provider) => (
              <a className="provider-card" href={provider.href} key={provider.name} target="_blank" rel="noopener noreferrer">
                <span className="provider-card__media">
                  <Image src={provider.image} alt="" fill sizes="(max-width: 880px) 100vw, 25vw" style={{ objectFit: "contain" }} />
                </span>
                <span className="provider-card__body">
                  <span className="provider-card__category">{provider.category}</span>
                  <span className="provider-card__title">
                    <span>
                      <small>{provider.name}</small>
                      <strong>{provider.product}</strong>
                    </span>
                  </span>
                  <span className="provider-card__tone">{provider.tone}</span>
                  <span className="provider-card__description">{provider.description}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
