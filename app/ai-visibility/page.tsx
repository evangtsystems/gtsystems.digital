import type { Metadata } from "next";
import VisibilityForm from "./form";
import "./style.css";

export const metadata: Metadata = {
  title: "Έλεγχος ορατότητας σε AI",
  description: "Δείτε αν μια επιχείρηση προτείνεται σε προκαθορισμένα ερωτήματα AI για υπηρεσίες και τοποθεσίες.",
};
export const dynamic = "force-dynamic";

export default function AiVisibilityPage() {
  return <main className="visibility-page">
    <section className="visibility-hero">
      <div className="visibility-wrap">
        <p className="visibility-eyebrow"><span /> ΕΛΕΓΧΟΣ ΟΡΑΤΟΤΗΤΑΣ AI</p>
        <h1>Σας προτείνει το AI στην περιοχή σας;</h1>
        <p className="visibility-intro">Το Playwright διαβάζει το site σας. Έπειτα δοκιμάζετε πέντε σταθερά ερωτήματα στο ChatGPT και πέντε στο Claude, και καταγράφετε εδώ τις απαντήσεις και τις πηγές τους.</p>
        <VisibilityForm />
      </div>
    </section>
    <section className="visibility-explainer">
      <div className="visibility-wrap visibility-explainer-grid">
        <div>
          <p className="visibility-eyebrow">ΤΙ ΣΗΜΑΙΝΕΙ ΤΟ ΑΠΟΤΕΛΕΣΜΑ</p>
          <h2>Ένα στιγμιότυπο, όχι υπόσχεση κατάταξης.</h2>
          <p>Οι απαντήσεις AI μεταβάλλονται. Η αναφορά δείχνει το μοντέλο, την ώρα, τα προκαθορισμένα ερωτήματα και τις πηγές που επέστρεψε η αναζήτηση, ώστε να μπορείτε να κρίνετε τι βρέθηκε.</p>
        </div>
        <aside>
          <strong>Τι ελέγχεται</strong>
          <ul>
            <li>Ανάγνωση έως έξι δημόσιων σελίδων με Playwright</li>
            <li>Πέντε σταθερά ερωτήματα σε κάθε consumer chat</li>
            <li>Καταγραφή απαντήσεων, αναφορών και πηγών</li>
          </ul>
          <p>Οι απαντήσεις καταχωρίζονται από εσάς μετά τη χρήση των consumer εφαρμογών ChatGPT και Claude. Το εργαλείο δεν ανοίγει ούτε διαβάζει αυτόματα τις συνομιλίες σας.</p>
        </aside>
      </div>
    </section>
  </main>;
}

