import type { Metadata } from "next";
import AuditForm from "./scan";
import "./style.css";

export const metadata: Metadata = { title: "AI Search Readiness Check", description: "Δωρεάν αρχικός έλεγχος δημόσιων σελίδων για αναζήτηση και AI." };

export default function AiReadinessPage() {
  return <div className="audit-page"><section className="audit-hero"><div className="audit-wrap"><p className="audit-eyebrow"><span /> ΕΡΓΑΛΕΙΟ ΑΠΟ ΤΗ GTSYSTEMS</p><h1>Πόσο προσβάσιμη είναι η επιχείρησή σας στο <em>AI search;</em></h1><p className="audit-intro">Μια καθαρή πρώτη εικόνα της ιστοσελίδας σας, με συγκεκριμένα ευρήματα και τις πηγές τους. Χωρίς εγγραφή, με αναλυτικό σκορ και πρακτικά επόμενα βήματα.</p><AuditForm /></div></section><section className="audit-explainer"><div className="audit-wrap audit-explainer-grid"><div><p className="audit-eyebrow">ΜΙΑ ΕΝΤΙΜΗ ΠΡΩΤΗ ΕΙΚΟΝΑ</p><h2>Τι ελέγχουμε.</h2><p>Εξετάζουμε την αρχική και έως πέντε ακόμη δημόσιες σελίδες που συνδέονται από αυτήν. Το αποτέλεσμα αφορά μόνο τις σελίδες και τα στοιχεία που καταφέραμε να διαβάσουμε.</p></div><div className="audit-points"><div><b>01</b><span><strong>Προσβασιμότητα</strong>Απάντηση σελίδας και κανόνες robots.txt για γνωστούς crawlers.</span></div><div><b>02</b><span><strong>Στοιχεία σελίδας</strong>Τίτλοι, επικεφαλίδες, περιγραφές, canonical και οδηγίες ευρετηρίασης.</span></div><div><b>03</b><span><strong>Πληροφορίες επιχείρησης</strong>Δομημένα δεδομένα και ορατό περιεχόμενο μετά την απόδοση της αρχικής σε browser.</span></div></div><div className="audit-visibility-promo"><div><p className="audit-eyebrow">ΕΠΙΠΛΕΟΝ ΕΛΕΓΧΟΣ</p><h2>Δείτε αν το AI προτείνει την επιχείρησή σας.</h2><p>Ελέγξτε προκαθορισμένα ερωτήματα για τις υπηρεσίες και την περιοχή σας, μαζί με τις απαντήσεις και τις πηγές.</p></div><a href="/ai-visibility">Έλεγχος ορατότητας AI →</a></div></div></section></div>;
}

