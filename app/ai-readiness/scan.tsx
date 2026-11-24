"use client";

import { FormEvent, useState } from "react";
import Score from "./score";

export type Finding = { title: string; status: "found" | "review" | "unknown"; detail: string; evidence?: string; url?: string };
type Report = { domain: string; checkedAt: string; pages: string[]; skipped: number; robotsStatus: string; findings: Finding[]; rendering: "complete" | "unavailable"; performanceReason: string; performance: { categories: Record<string, number | null>; metrics: Record<string, string | null>; finalUrl: string } | null };

const labels = { found: "ΕΝΤΟΠΙΣΤΗΚΕ", review: "ΓΙΑ ΕΛΕΓΧΟ", unknown: "ΔΕΝ ΕΠΙΒΕΒΑΙΩΘΗΚΕ" };

export default function AuditForm() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(""); setReport(null);
    try {
      const res = await fetch("/api/ai-readiness", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domain }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReport(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Κάτι πήγε στραβά."); }
    finally { setLoading(false); }
  }

  return <>
    <form onSubmit={submit} className="audit-form">
      <label htmlFor="audit-domain">Η διεύθυνση της ιστοσελίδας σας</label>
      <div className="audit-input-row"><input id="audit-domain" value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.gr" required maxLength={253} autoCapitalize="none" spellCheck={false} /><button aria-busy={loading} disabled={loading} type="submit">{loading && <span className="audit-spinner" aria-hidden="true" />}{loading ? "Ο έλεγχος εκτελείται…" : "Έναρξη δωρεάν ελέγχου →"}</button></div>
      <p>Δεν χρειάζεται email. Ο έλεγχος συνδέεται στη δημόσια ιστοσελίδα που καταχωρίζετε.</p>
    </form>
    <div aria-live="polite">{error && <p className="audit-error" role="alert">{error}</p>}{loading && <p className="audit-loading">Εξετάζουμε δημόσιες σελίδες. Αυτό μπορεί να διαρκέσει λίγο.</p>}</div>
    {report && <section className="audit-report" aria-labelledby="report-title">
      <div className="audit-report-head"><div><p className="audit-eyebrow">ΑΠΟΤΕΛΕΣΜΑ ΕΛΕΓΧΟΥ</p><h2 id="report-title">Η πρώτη εικόνα.</h2><p>{report.domain} · {new Date(report.checkedAt).toLocaleString("el-GR", { timeZone: "Europe/Athens" })}</p></div><span>{report.pages.length} {report.pages.length === 1 ? "ΣΕΛΙΔΑ" : "ΣΕΛΙΔΕΣ"}</span></div>
      <p className="audit-disclaimer">Ο έλεγχος δεν διαπιστώνει αν η επιχείρησή σας εμφανίζεται σε απαντήσεις AI και δεν εγγυάται κατάταξη. Οι κανόνες crawlers αφορούν μόνο την αρχική σελίδα. Η αρχική ελέγχεται με JavaScript όταν υπάρχει διαθέσιμος browser· οι υπόλοιπες σελίδες ελέγχονται μόνο στο αρχικό HTML.</p>
      <Score findings={report.findings} pages={report.pages.length} />
      <details className="audit-findings-panel"><summary>Περιεχόμενο &amp; στοιχεία επιχείρησης <span>4 έλεγχοι</span></summary><div className="audit-findings">{report.findings.filter(f => /^(Σαφήνεια περιεχομένου · δείγμα|Πεδία schema επιχείρησης|Συνέπεια στοιχείων επιχείρησης|Θεματική κάλυψη)/.test(f.title)).map(f => <details className="audit-finding" key={f.title}><summary><h3>{f.title}</h3><span className={`audit-status audit-status--${f.status}`}>{labels[f.status]}</span></summary><div className="audit-finding-body"><p>{f.detail}</p>{f.evidence && <blockquote>{f.evidence}</blockquote>}{f.url && <a href={f.url} target="_blank" rel="noreferrer">Δείτε την πηγή ↗</a>}</div></details>)}</div></details>
      <section className="audit-performance"><p className="audit-eyebrow">GOOGLE PAGESPEED INSIGHTS · MOBILE</p><h3>Ταχύτητα &amp; προσβασιμότητα</h3>{report.performance ? <><p>Εργαστηριακή δοκιμή της αρχικής σελίδας από Lighthouse. Τα σκορ δεν αποτελούν αξιολόγηση GEO και μπορεί να διαφέρουν μεταξύ δοκιμών.</p><div className="audit-speed-grid">{Object.entries({ performance: "Απόδοση", accessibility: "Προσβασιμότητα", seo: "SEO", "best-practices": "Βέλτιστες πρακτικές" }).map(([key, label]) => <div key={key}><strong>{report.performance?.categories[key] ?? "—"}</strong><span>{label}</span></div>)}</div><p>LCP: {report.performance.metrics["largest-contentful-paint"] ?? "μη διαθέσιμο"} · TBT: {report.performance.metrics["total-blocking-time"] ?? "μη διαθέσιμο"} · CLS: {report.performance.metrics["cumulative-layout-shift"] ?? "μη διαθέσιμο"}</p></> : <p>{report.performanceReason} Δεν έχει δοθεί σκορ.</p>}<a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(report.domain)}`} target="_blank" rel="noreferrer">Δείτε την αναλυτική αναφορά στο PageSpeed ↗</a></section>
      <details className="audit-pages"><summary>Σελίδες που ελέγχθηκαν</summary><ul>{report.pages.map(p => <li key={p}><a href={p} target="_blank" rel="noreferrer">{p} ↗</a></li>)}</ul>{report.skipped > 0 && <p>{report.skipped} σύνδεσμοι παραλείφθηκαν ή δεν ήταν προσβάσιμοι.</p>}<p>{report.robotsStatus}</p></details>
      <details className="audit-findings-panel"><summary>Αναλυτικά ευρήματα <span>{report.findings.length}</span></summary><div className="audit-findings">{report.findings.map((f, i) => <details className="audit-finding" key={`${f.title}-${i}`}><summary><h3>{f.title}</h3><span className={`audit-status audit-status--${f.status}`}>{labels[f.status]}</span></summary><div className="audit-finding-body"><p>{f.detail}</p>{f.evidence && <blockquote>{f.evidence}</blockquote>}{f.url && <a href={f.url} target="_blank" rel="noreferrer">Δείτε την πηγή ↗</a>}</div></details>)}</div></details>
      <p className="audit-footnote">Ο έλεγχος είναι ενδεικτικός και δεν υποκαθιστά πλήρη τεχνική αξιολόγηση.</p>
    </section>}
  </>;
}
