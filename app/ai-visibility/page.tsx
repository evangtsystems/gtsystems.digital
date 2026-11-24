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
        <p className="visibility-intro">Δοκιμάζουμε πέντε σταθερά ερωτήματα για την υπηρεσία και την περιοχή σας και καταγράφουμε την απάντηση, τις πηγές και τις επιχειρήσεις που αναφέρονται.</p>
        <VisibilityForm configured={Boolean(process.env.GEMINI_API_KEY)} />
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
            <li>Πέντε ερωτήματα για υπηρεσία και περιοχή</li>
            <li>Αναφορά ή μη αναφορά της επιχείρησης στις απαντήσεις</li>
            <li>Απάντηση και διαθέσιμες πηγές για κάθε ερώτημα</li>
          </ul>
          <p>Δεν είναι έλεγχος ChatGPT, Claude ή Perplexity και δεν δείχνει πραγματικά search analytics ή Google indexing.</p>
        </aside>
      </div>
    </section>
  </main>;
}
