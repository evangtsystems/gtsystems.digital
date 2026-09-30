import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Εταιρεία",
  description:
    "Η GTSystems είναι εταιρεία επιχειρησιακών λύσεων πληροφορικής με έδρα την Κέρκυρα από το 2005.",
};

export default function CompanyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Σχετικά με την GTSystems</p>
          <h1>Τοπική τεχνογνωσία, ολοκληρωμένη επιχειρησιακή τεχνολογία.</h1>
          <p>
            Από το {site.founded}, η GTSystems βοηθά επιχειρήσεις να επιλέγουν, να εγκαθιστούν,
            να συνδέουν και να υποστηρίζουν τα συστήματα στα οποία βασίζονται καθημερινά.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container two-column">
          <div>
            <h2>Τι υποστηρίζουμε</h2>
            <p>
              Συνεργαζόμαστε με επιχειρήσεις που χρειάζονται πρακτικές τεχνολογικές αποφάσεις,
              όχι γενικές συμβουλές. Αυτό σημαίνει κατανόηση της λειτουργίας, ρύθμιση συστημάτων
              γύρω από πραγματικές ανάγκες και διαθεσιμότητα όταν χρειάζεται υποστήριξη.
            </p>
            <p>
              Η δουλειά μας καλύπτει εμπορικό λογισμικό, ταμειακά και POS συστήματα, service
              υπολογιστών, δίκτυα, τηλεπικοινωνίες, ιστοσελίδες, web apps και αυτοματισμούς
              επιχειρησιακών διαδικασιών.
            </p>
            <div className="section-actions">
              <Link className="button" href="/contact">
                Ξεκινήστε μια συζήτηση
              </Link>
            </div>
          </div>

          <aside className="contact-card">
            <h2>Δίπλα σας σε κάθε βήμα</h2>
            <p>
              <strong>20+ χρόνια εμπειρίας</strong>
              <br />
              Πρακτικές λύσεις πληροφορικής για τις καθημερινές ανάγκες της επιχείρησής σας.
            </p>
            <p>
              <strong>Εξυπηρέτηση σε όλη την Ελλάδα</strong>
              <br />
              Ένας συνεργάτης για λογισμικό, εξοπλισμό, δίκτυα και web εφαρμογές.
            </p>
            <p>
              <strong>Συνεχής υποστήριξη</strong>
              <br />
              Από την επιλογή και την εγκατάσταση έως την καθημερινή λειτουργία των συστημάτων σας.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
