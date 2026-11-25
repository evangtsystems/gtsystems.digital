"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Finding = { title: string; status: "found" | "review" | "unknown"; detail: string; evidence?: string; url?: string };
type SiteReport = { domain: string; checkedAt: string; pages: string[]; skipped: number; robotsStatus: string; findings: Finding[]; rendering: "complete" | "unavailable"; performance: Record<string, number | null> | null; performanceReason: string };
type Question = { id: string; text: string };
type Provider = { id: "chatgpt" | "claude"; name: string; url: string; questions: Question[] };
const STORAGE_KEY = "gtsystems-ai-visibility-manual-v1";

const providers: Provider[] = [
  {
    id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/",
    questions: [
      { id: "recommend", text: "Χρησιμοποιώντας αναζήτηση ιστού, ποιες επιχειρήσεις προτείνεις για {service} στην περιοχή {area}; Δώσε σύντομη λίστα με πραγματικές επιχειρήσεις και πηγές." },
      { id: "local", text: "Χρησιμοποιώντας αναζήτηση ιστού, αν κάποιος στην περιοχή {area} χρειάζεται {service}, ποιες τοπικές επιχειρήσεις αξίζει να εξετάσει και γιατί; Παράθεσε πηγές." },
      { id: "providers", text: "Χρησιμοποιώντας αναζήτηση ιστού, βρες τρεις επιχειρήσεις που παρέχουν {service} και εξυπηρετούν την περιοχή {area}. Προτίμησε επίσημες ή ανεξάρτητες πηγές." },
      { id: "trusted", text: "Χρησιμοποιώντας αναζήτηση ιστού, ποιοι είναι αξιόπιστοι πάροχοι για {service} στην περιοχή {area}; Ανέφερε στοιχεία που τεκμηριώνουν την απάντηση." },
      { id: "compare", text: "Χρησιμοποιώντας αναζήτηση ιστού, σύγκρινε επιλογές για {service} στην περιοχή {area}. Ποια επιχείρηση θα πρότεινες και ποιες πηγές στηρίζουν την πρόταση;" },
    ],
  },
  {
    id: "claude", name: "Claude", url: "https://claude.ai/new",
    questions: [
      { id: "recommend", text: "Χρησιμοποίησε αναζήτηση ιστού για να προτείνεις επιχειρήσεις για {service} στην περιοχή {area}. Δώσε σύντομη λίστα με πραγματικές επιχειρήσεις και πηγές." },
      { id: "local", text: "Με αναζήτηση ιστού, ποιες τοπικές επιχειρήσεις στην περιοχή {area} αξίζει να εξετάσει κάποιος για {service}; Εξήγησε σύντομα και παράθεσε πηγές." },
      { id: "providers", text: "Βρες μέσω αναζήτησης ιστού τρεις επιχειρήσεις που παρέχουν {service} και εξυπηρετούν την περιοχή {area}. Προτίμησε επίσημες ή ανεξάρτητες πηγές." },
      { id: "trusted", text: "Ποιοι πάροχοι φαίνονται αξιόπιστοι για {service} στην περιοχή {area}; Αναζήτησε πηγές στον ιστό και τεκμηρίωσε την απάντηση." },
      { id: "compare", text: "Σύγκρινε επιχειρήσεις για {service} στην περιοχή {area} με βάση πληροφορίες που βρίσκεις στον ιστό. Ποια θα πρότεινες και γιατί; Παράθεσε πηγές." },
    ],
  },
];

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function extractUrls(value: string) {
  return [...new Set(value.match(/https?:\/\/[^\s<>{}\[\]"']+/gi) || [])].map((raw) => {
    const cleaned = raw.replace(/[),.;!?]+$/, "");
    try { const url = new URL(cleaned); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
  }).filter(Boolean).slice(0, 8);
}

export default function VisibilityForm() {
  const [form, setForm] = useState({ name: "", website: "", service: "", area: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<SiteReport | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.form && typeof data.form === "object") setForm(data.form);
        if (data.report && typeof data.report === "object") setReport(data.report);
        if (data.answers && typeof data.answers === "object") setAnswers(data.answers);
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, report, answers }));
  }, [restored, form, report, answers]);

  const websiteHost = useMemo(() => {
    try { return new URL(/^https?:\/\//i.test(form.website) ? form.website : `https://${form.website}`).hostname.replace(/^www\./i, ""); } catch { return ""; }
  }, [form.website]);

  const mentionCount = (provider: Provider) => provider.questions.filter((question) => {
    const answer = normalized(answers[`${provider.id}-${question.id}`] || "");
    if (!answer) return false;
    const name = normalized(form.name);
    const host = normalized(websiteHost).replace(/\s/g, "");
    return (!!name && answer.includes(name)) || (!!host && answer.replace(/\s/g, "").includes(host));
  }).length;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setReport(null); setAnswers({});
    try {
      const response = await fetch("/api/ai-readiness", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domain: form.website }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Δεν ήταν δυνατή η ανάγνωση του site.");
      setReport(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Παρουσιάστηκε σφάλμα."); }
    finally { setBusy(false); }
  }

  async function copyAndOpen(question: string, key: string, providerUrl: string) {
    // Open synchronously from the click gesture so the browser allows the new tab.
    window.open(providerUrl, "_blank", "noopener,noreferrer");
    try { await navigator.clipboard.writeText(question); setCopied(key); window.setTimeout(() => setCopied(""), 1800); }
    catch { setError("Άνοιξε το chat, αλλά δεν ήταν δυνατή η αντιγραφή. Αντέγραψε το ερώτημα χειροκίνητα."); }
  }

  function questionFor(template: string) {
    return template.replaceAll("{service}", form.service.trim()).replaceAll("{area}", form.area.trim());
  }

  function clearSavedReport() {
    setReport(null); setAnswers({}); setForm({ name: "", website: "", service: "", area: "" }); setError("");
    localStorage.removeItem(STORAGE_KEY);
  }

  return <>
    <form className="visibility-form" onSubmit={submit}>
      <div className="visibility-fields">
        <label>Όνομα επιχείρησης<input autoComplete="organization" maxLength={100} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="π.χ. GTSystems" /></label>
        <label>Ιστοσελίδα<input autoCapitalize="none" autoComplete="url" maxLength={253} required value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="example.gr" /></label>
        <label>Υπηρεσία<input maxLength={120} required value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} placeholder="π.χ. τεχνική υποστήριξη υπολογιστών" /></label>
        <label>Περιοχή<input maxLength={120} required value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="π.χ. Κέρκυρα" /></label>
      </div>
      <label className="visibility-consent"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Κατανοώ ότι ο server θα ανοίξει το δημόσιο site για τεχνικό έλεγχο με Playwright. Οι απαντήσεις ChatGPT και Claude θα τις καταχωρίσω εγώ· δεν αποστέλλονται από το εργαλείο στους παρόχους.</span></label>
      <button type="submit" disabled={busy}>{busy && <span className="visibility-spinner" aria-hidden="true" />}{busy ? "Το Playwright ελέγχει το site…" : "Έλεγχος site και ετοιμασία ερωτημάτων →"}</button>
      <p className="visibility-form-note">Crawler εξετάζει έως έξι δημόσιες σελίδες · Playwright αποδίδει την αρχική με JavaScript</p>
    </form>
    <div aria-live="polite">{error && <p className="visibility-error" role="alert">{error}</p>}</div>

    {report && <section className="visibility-report" aria-labelledby="visibility-report-title">
      <header className="visibility-report-head"><div><p className="visibility-eyebrow">ΑΝΑΓΝΩΣΗ SITE ΜΕ PLAYWRIGHT</p><h2 id="visibility-report-title">Το site διαβάστηκε. Ώρα για τα consumer chats.</h2><p>{report.domain} · {report.pages.length} σελίδες · {report.rendering === "complete" ? "JavaScript περιεχόμενο αποδόθηκε" : "Δεν ήταν διαθέσιμη η απόδοση JavaScript"}</p><p>{new Date(report.checkedAt).toLocaleString("el-GR", { timeZone: "Europe/Athens" })}</p></div><div className="visibility-count">{report.findings.filter((finding) => finding.status === "review").length}<small>σημεία για έλεγχο</small></div></header>
      <button className="visibility-clear" type="button" onClick={clearSavedReport}>Καθαρισμός αποθηκευμένου ελέγχου</button>
      <p className="visibility-disclaimer">Ο crawler εξετάζει έως έξι δημόσιες σελίδες και το Playwright αποδίδει την αρχική με JavaScript. Για πραγματικές απαντήσεις ChatGPT και Claude, αντέγραψε κάθε ερώτημα στο αντίστοιχο consumer chat, ενεργοποίησε αναζήτηση ιστού όπου είναι διαθέσιμη και επικόλλησε εδώ ολόκληρη την απάντηση. Η αυτόματη ένδειξη αναφοράς ελέγχει την επωνυμία ή το domain· επιβεβαίωσε την κρίση χειροκίνητα.</p>

      <details className="visibility-site-findings"><summary>Τεχνική ανάγνωση site από Playwright · {report.findings.length} ευρήματα</summary><div className="visibility-findings-list">{report.findings.map((finding, index) => <article key={`${finding.title}-${index}`}><div><b className={`finding-${finding.status}`}>{finding.status === "found" ? "Εντοπίστηκε" : finding.status === "review" ? "Για αξιολόγηση" : "Άγνωστο"}</b><h3>{finding.title}</h3></div><p>{finding.detail}</p>{finding.evidence && <small>{finding.evidence}</small>}{finding.url && <a href={finding.url} target="_blank" rel="noreferrer">Σελίδα πηγής ↗</a>}</article>)}</div><p className="visibility-report-note">Οι επισημάνσεις «Για αξιολόγηση» είναι ενδείξεις για ανθρώπινο έλεγχο, όχι αυτόματη απόδειξη σφάλματος.</p></details>

      {providers.map((provider) => <section className="visibility-provider" key={provider.id}><header className="visibility-provider-head"><div><h3>{provider.name}</h3><p>Καταχωρισμένες απαντήσεις: {provider.questions.filter((question) => !!answers[`${provider.id}-${question.id}`]?.trim()).length}/5</p></div><div className="visibility-count">{mentionCount(provider)}<small>/5 αναφορές</small></div></header><p className="visibility-provider-help">Πάτησε «Αντιγραφή & άνοιγμα {provider.name}». Το ερώτημα αντιγράφεται και το chat ανοίγει σε νέα καρτέλα· κάνε επικόλληση και μετά βάλε την απάντηση στο πεδίο εδώ.</p><div className="visibility-results">{provider.questions.map((question, index) => {
        const key = `${provider.id}-${question.id}`;
        const answer = answers[key] || "";
        const mentioned = !!answer.trim() && ((!!normalized(form.name) && normalized(answer).includes(normalized(form.name))) || (!!normalized(websiteHost) && normalized(answer).replace(/\s/g, "").includes(normalized(websiteHost).replace(/\s/g, ""))));
        const urls = extractUrls(answer);
        return <article className="visibility-result" key={question.id}><div className="visibility-result-title"><span>{String(index + 1).padStart(2, "0")}</span><h3>{questionFor(question.text)}</h3><b className={mentioned ? "is-mentioned" : answer.trim() ? "not-mentioned" : "is-unknown"}>{mentioned ? "Εντοπίστηκε όνομα/domain" : answer.trim() ? "Δεν εντοπίστηκε αυτόματα" : "Αναμονή απάντησης"}</b></div><div className="visibility-question-actions"><button type="button" onClick={() => copyAndOpen(questionFor(question.text), key, provider.url)}>{copied === key ? "Αντιγράφηκε · άνοιξε το chat ✓" : `Αντιγραφή & άνοιγμα ${provider.name} ↗`}</button></div><label className="visibility-answer-label">Επικόλλησε εδώ την απάντηση<textarea rows={5} value={answer} onChange={(event) => setAnswers({ ...answers, [key]: event.target.value })} placeholder="Κάνε επικόλληση ολόκληρης της απάντησης, μαζί με τις πηγές…" /></label>{answer.trim() && <p className="visibility-manual-hint">Έλεγχος αναφοράς με βάση το όνομα ή το domain. Αν χρησιμοποιείται διαφορετική επωνυμία, σημείωσέ το χειροκίνητα κατά την αξιολόγηση.</p>}{urls.length > 0 && <div className="visibility-citations"><strong>Σύνδεσμοι που επικολλήθηκαν</strong>{urls.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer">{new URL(url).hostname} ↗</a>)}</div>}</article>;
      })}</div></section>)}
    </section>}
  </>;
}
