import type { CSSProperties } from "react";
import type { Finding } from "./scan";

function instruction(f: Finding) {
 if (f.title.startsWith("Διεύθυνση schema")) return "Συγκρίνετε τη διεύθυνση του schema με το επίσημο domain και την canonical διεύθυνση. Διορθώστε την μόνο αν δεν εκφράζει σωστά την επιχείρηση.";
 if (f.title.startsWith("Επωνυμία schema")) return "Συγκρίνετε τη νόμιμη ή εμπορική επωνυμία στο schema με την επωνυμία που εμφανίζεται στους επισκέπτες, λαμβάνοντας υπόψη τις συντομογραφίες.";
 if (f.title.startsWith("Σύνταξη JSON-LD")) return "Διορθώστε το μη έγκυρο JSON και ελέγξτε ξανά το markup με Schema Markup Validator ή Rich Results Test.";
 if (f.title.startsWith("Canonical")) return "Ελέγξτε ποια διεύθυνση θέλετε να θεωρείται η βασική για τη σελίδα και, όπου χρειάζεται, δηλώστε την με canonical link.";
 if (f.title.startsWith("Σαφήνεια αρχικής")) return "Εξετάστε αν ο κύριος τίτλος ή το κείμενο ακριβώς δίπλα του εξηγεί συγκεκριμένα ποια υπηρεσία προσφέρετε και σε ποια περιοχή. Ένας δημιουργικός τίτλος μπορεί να παραμείνει, αν το υπόλοιπο περιεχόμενο δίνει αμέσως το απαραίτητο πλαίσιο.";
 if (f.title.includes("robots.txt")) return "Ελέγξτε τον κανόνα για τον συγκεκριμένο crawler. Αν θέλετε να επιτρέψετε την πρόσβαση, αναθεωρήστε το robots.txt και επιβεβαιώστε ότι δεν τον εμποδίζει και το firewall.";
 if (f.title.startsWith("Οδηγία ευρετηρίασης")) return "Ελέγξτε αν η σελίδα πρέπει να εμφανίζεται στην αναζήτηση. Αν ναι, διορθώστε την οδηγία noindex στην πηγή της και ελέγξτε ξανά.";
 if (f.title.startsWith("Τίτλος")) return "Προσθέστε έναν σαφή τίτλο που περιγράφει το περιεχόμενο και την επιχείρηση ή την υπηρεσία της σελίδας.";
 if (f.title.startsWith("Κύρια επικεφαλίδα")) return "Προσθέστε μια περιγραφική κύρια επικεφαλίδα στο περιεχόμενο της σελίδας. Αν δημιουργείται με JavaScript, επιβεβαιώστε την και σε έλεγχο με απόδοση της σελίδας.";
 if (f.title.startsWith("Περιγραφή")) return "Γράψτε μια σύντομη, μοναδική περιγραφή για τη σελίδα. Μπορεί να βοηθήσει στην παρουσίαση στα αποτελέσματα αναζήτησης, χωρίς να εγγυάται θέση ή εμφάνιση σε AI.";
 return "Ελέγξτε χειροκίνητα το στοιχείο και τις πραγματικές ανάγκες της σελίδας.";
}

function SignalBubble({
 title,
 label,
 tone,
 items,
 empty,
}: {
 title: string;
 label: string;
 tone: "strength" | "review" | "unknown";
 items: Finding[];
 empty: string;
}) {
 return <section className={`readiness-bubble readiness-bubble--${tone}`}>
  <div className="readiness-bubble-head"><span aria-hidden="true">{tone === "strength" ? "＋" : tone === "review" ? "↗" : "?"}</span><p>{label}</p></div>
  <h3>{title}</h3>
  {items.length ? <ul>{items.map((item, index) => <li key={`${item.title}-${index}`}>
   <strong>{item.title}</strong>
   <span>{item.detail}</span>
  </li>)}</ul> : <p className="readiness-bubble-empty">{empty}</p>}
 </section>;
}

export default function Score({findings, pages}: {findings:Finding[]; pages:number}) {
 const checks=findings.filter(f => f.title.includes("· robots.txt") || /^(Τίτλος|Κύρια επικεφαλίδα|Οδηγία ευρετηρίασης|Περιγραφή|Γλώσσα HTML|Viewport|Εναλλακτικό κείμενο εικόνων|Μοναδικότητα τίτλου) ·/.test(f.title));
 const measured=checks.filter(f=>f.status!=="unknown");
 const passed=measured.filter(f=>f.status==="found").length;
 const ratio=measured.length ? passed/measured.length : null;
 const score=ratio===null ? null : Math.round(ratio*80);
 const ringStyle={"--score-progress":`${ratio===null?0:Math.round(ratio*100)}%`} as CSSProperties;
 const sortByPriority=(a:Finding,b:Finding)=>{
  const priority=(f:Finding)=>f.title.includes("robots.txt")||f.title.startsWith("Οδηγία")?0:f.title.startsWith("Τίτλος")||f.title.startsWith("Κύρια")?1:2;
  return priority(a)-priority(b);
 };
 const improvements=findings.filter(f=>f.status==="review").sort(sortByPriority);
 const strengths=findings.filter(f=>f.status==="found").slice(0,3);
 const unknown=checks.filter(f=>f.status==="unknown");

 return <>
  <section className="readiness-overview" aria-labelledby="readiness-overview-title">
   <div className="readiness-overview-heading">
    <p className="audit-eyebrow">Η ΕΙΚΟΝΑ ΣΕ ΜΙΑ ΜΑΤΙΑ</p>
    <h2 id="readiness-overview-title">Τα δυνατά σήματα και όσα αξίζει να εξετάσετε.</h2>
    <p>Κάθε σημείο προέρχεται από τους ελέγχους και τις σελίδες που εξετάσαμε.</p>
   </div>
   <div className="readiness-orbit">
    <SignalBubble tone="strength" label="ΘΕΤΙΚΑ ΣΗΜΑΤΑ" title="Τι βρέθηκε" items={strengths} empty="Δεν επιβεβαιώθηκαν θετικά σήματα στους συγκεκριμένους ελέγχους." />
    <div className="readiness-score-ring" style={ringStyle} role="img" aria-label={score===null?"Το σκορ δεν είναι διαθέσιμο":`${score} από 80 τεχνικούς πόντους`}>
     <div className="readiness-score-inner">
      <span>ΤΕΧΝΙΚΑ ΣΗΜΑΤΑ</span>
      <strong>{score===null?"—":score}</strong>
      <small>από 80 πόντους</small>
      <em>{passed} / {measured.length} επιβεβαιωμένοι έλεγχοι</em>
     </div>
    </div>
    <SignalBubble tone="review" label="ΓΙΑ ΕΠΑΝΕΞΕΤΑΣΗ" title="Ευκαιρίες βελτίωσης" items={improvements.slice(0,3)} empty="Δεν επισημάνθηκαν προβλήματα σε αυτούς τους ελέγχους." />
    <SignalBubble tone="unknown" label="ΕΚΤΟΣ ΑΥΤΟΜΑΤΟΥ ΣΚΟΡ" title="Δεν αξιολογήθηκε" items={unknown.slice(0,2)} empty="Οι συγκεκριμένοι τεχνικοί έλεγχοι επιβεβαιώθηκαν." />
   </div>
   <div className="readiness-scope">
    <div><span>ΤΙ ΜΕΤΡΑ</span><p>Μέχρι 80 πόντους από επαληθεύσιμους τεχνικούς ελέγχους στις {pages} σελίδες του δείγματος.</p></div>
    <div><span>ΤΙ ΔΕΝ ΜΕΤΡΑ</span><p>Ποιότητα περιεχομένου, πραγματική ευρετηρίαση και εμφάνιση σε απαντήσεις AI. Αυτά χρειάζονται ξεχωριστό έλεγχο.</p></div>
    <details><summary>Πώς υπολογίζεται</summary><p>Κάθε επιβεβαιωμένος έλεγχος μετρά ισότιμα. Το σκορ είναι το ποσοστό επιτυχών ελέγχων επί των επιβεβαιωμένων, μεταφερμένο σε κλίμακα 80 πόντων. Άγνωστα ή μη διαθέσιμα στοιχεία εξαιρούνται και δεν θεωρούνται αδυναμίες. Η παρουσία ενός στοιχείου δεν αξιολογεί την ποιότητά του.</p></details>
   </div>
  </section>
  <section className="readiness-actions">
   <p className="audit-eyebrow">ΕΠΟΜΕΝΑ ΒΗΜΑΤΑ</p>
   <h3>Ευρήματα για προσεκτικό έλεγχο.</h3>
   {improvements.length ? <div className="readiness-action-list">{improvements.map((f,i)=><article key={`${f.title}-${i}`}><span>{String(i+1).padStart(2,"0")}</span><div><h4>{f.title}</h4>{f.evidence && <blockquote>{f.evidence}</blockquote>}<p>{f.detail}</p><p>{instruction(f)}</p>{f.url && <a href={f.url} target="_blank" rel="noreferrer">Δείτε τη σελίδα ή το αρχείο ↗</a>}</div></article>)}</div> : <p>Δεν εντοπίστηκε ζήτημα στους αυτοματοποιημένους ελέγχους. Ακολουθούν προαιρετικά σημεία που απαιτούν ανθρώπινη αξιολόγηση.</p>}
   <div className="readiness-manual"><strong>Πιθανά θέματα για ανθρώπινη αξιολόγηση</strong><p>Ελέγξτε αν οι σελίδες υπηρεσιών εξηγούν τι προσφέρετε, πού και σε ποιους, αν υπάρχουν παραδείγματα έργων και αν τα στοιχεία επιχείρησης είναι συνεπή. Αυτά είναι ερωτήματα για έλεγχο, όχι επιβεβαιωμένες αδυναμίες.</p><p>Τα δομημένα δεδομένα μπορούν να ελεγχθούν με το <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">Rich Results Test ↗</a>. Η απουσία τους δεν αποδεικνύει πρόβλημα στην AI αναζήτηση.</p></div>
  </section>
 </>;
}
