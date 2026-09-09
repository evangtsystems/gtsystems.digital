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
            <h2>Στοιχεία Εταιρείας</h2>
            <p>
              <strong>{site.legalName}</strong>
              <br />
              {site.address}
              <br />
              Αρ. ΓΕΜΗ: {site.registryNumber}
            </p>
            <p>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
