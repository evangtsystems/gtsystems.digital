import type { Metadata } from "next";
import VisibilityForm from "./form";
import "./style.css";

export const metadata: Metadata = {
  title: "Έλεγχος ορατότητας σε AI",
  description: "Δείτε αν μια επιχείρηση προτείνεται σε προκαθορισμένα ερωτήματα AI για υπηρεσίες και τοποθεσίες.",
};
export const dynamic = "force-dynamic";

export default function AiVisibilityPage() {
  const configuredProviders = [
    process.env.OPENAI_API_KEY ? "ChatGPT" : null,
    process.env.ANTHROPIC_API_KEY ? "Claude" : null,
    process.env.GEMINI_API_KEY ? "Gemini" : null,
  ].filter((provider): provider is string => Boolean(provider));
  return <main className="visibility-page">
    <section className="visibility-hero">
      <div className="visibility-wrap">
        <p className="visibility-eyebrow"><span /> ΕΛΕΓΧΟΣ ΟΡΑΤΟΤΗΤΑΣ AI</p>
        <h1>Σας προτείνει το AI στην περιοχή σας;</h1>
        <p className="visibility-intro">Δοκιμάζουμε πέντε σταθερά ερωτήματα σε ChatGPT και Claude, καθώς και σε όποιον άλλο πάροχο έχει ενεργοποιηθεί, και καταγράφουμε απαντήσεις, πηγές και αναφορές επιχειρήσεων.</p>
        <VisibilityForm configuredProviders={configuredProviders} />
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
            <li>Πέντε ερωτήματα ανά ενεργό μοντέλο</li>
            <li>Αναφορά ή μη αναφορά της επιχείρησης στις απαντήσεις</li>
            <li>Απάντηση και διαθέσιμες πηγές για κάθε ερώτημα</li>
          </ul>
          <p>Οι απαντήσεις προέρχονται από τα επίσημα API των ενεργών παρόχων με αναζήτηση ιστού. Δεν είναι αυτούσιες συνεδρίες στις εφαρμογές ChatGPT ή Claude και δεν δείχνουν search analytics ή Google indexing.</p>
        </aside>
      </div>
    </section>
  </main>;
}
