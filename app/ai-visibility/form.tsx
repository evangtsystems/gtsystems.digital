"use client";

import { FormEvent, useState } from "react";

type Result = { query: string; answer: string; searchQueries: string[]; citations: { title: string; url: string }[]; businessMentioned: boolean; error?: string };
type ProviderReport = { provider: string; model: string; completed: number; mentions: number; results: Result[] };
type Report = { name: string; website: string; area: string; service: string; checkedAt: string; providers: ProviderReport[] };

export default function VisibilityForm({ configuredProviders }: { configuredProviders: string[] }) {
  const configured = configuredProviders.length > 0;
  const [form, setForm] = useState({ name: "", website: "", service: "", area: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setReport(null);
    try {
      const response = await fetch("/api/ai-visibility", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Δεν ήταν δυνατή η ολοκλήρωση του ελέγχου.");
      setReport(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Παρουσιάστηκε σφάλμα."); }
    finally { setBusy(false); }
  }

  return <>
    {!configured && <div className="visibility-config-note"><strong>Η υπηρεσία δεν έχει ενεργοποιηθεί ακόμη.</strong><span>Απαιτείται τουλάχιστον ένα API key (OpenAI, Anthropic ή Gemini) στο περιβάλλον του server. Δεν ζητάμε ή αποθηκεύουμε κλειδί από τον επισκέπτη.</span></div>}
    <form className="visibility-form" onSubmit={submit}>
      <div className="visibility-fields">
        <label>Όνομα επιχείρησης<input autoComplete="organization" maxLength={100} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="π.χ. GTSystems" /></label>
        <label>Ιστοσελίδα<input autoCapitalize="none" autoComplete="url" maxLength={253} required value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="example.gr" /></label>
        <label>Υπηρεσία<input maxLength={120} required value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} placeholder="π.χ. τεχνική υποστήριξη υπολογιστών" /></label>
        <label>Περιοχή<input maxLength={120} required value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="π.χ. Κέρκυρα" /></label>
      </div>
      <label className="visibility-consent"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Κατανοώ ότι τα ερωτήματα περιλαμβάνουν μόνο υπηρεσία και περιοχή και αποστέλλονται στους ενεργούς παρόχους: {configuredProviders.join(", ")}. Το όνομα και το domain παραμένουν στον server για σύγκριση με τις απαντήσεις. Η χρήση υπόκειται στους όρους και την πολιτική δεδομένων κάθε παρόχου. Δεν θα καταχωρίσω εμπιστευτικές πληροφορίες.</span></label>
      <button type="submit" disabled={busy || !configured}>{busy && <span className="visibility-spinner" aria-hidden="true" />}{busy ? "Εκτελούνται τα ερωτήματα…" : configured ? "Έναρξη ελέγχου →" : "Απαιτείται ρύθμιση server"}</button>
      <p className="visibility-form-note">Πέντε προκαθορισμένα ερωτήματα ανά ενεργό AI · αποτελέσματα με διαθέσιμες πηγές</p>
    </form>
    <div aria-live="polite">{error && <p className="visibility-error" role="alert">{error}</p>}</div>
    {report && <section className="visibility-report" aria-labelledby="visibility-report-title">
      <header className="visibility-report-head"><div><p className="visibility-eyebrow">ΑΠΟΤΕΛΕΣΜΑΤΑ ΣΤΙΓΜΙΟΤΥΠΟΥ</p><h2 id="visibility-report-title">Αναφορές επιχείρησης ανά AI</h2><p>{report.name} · {report.service} · {report.area}</p><p>{new Date(report.checkedAt).toLocaleString("el-GR", { timeZone: "Europe/Athens" })}</p></div></header>
      <p className="visibility-disclaimer">Κάθε ενότητα αφορά μόνο τα ερωτήματα και το μοντέλο που αναφέρονται, στη συγκεκριμένη χρονική στιγμή. Δεν ισοδυναμεί με θέση κατάταξης ούτε προβλέπει τι θα απαντήσουν άλλες πλατφόρμες.</p>
      {report.providers.map((provider) => <section className="visibility-provider" key={`${provider.provider}-${provider.model}`}><header className="visibility-provider-head"><div><h3>{provider.provider}</h3><p>{provider.model}</p></div><div className="visibility-count">{provider.mentions}<small>/{provider.completed}</small></div></header><div className="visibility-results">{provider.results.map((result, index) => <article className="visibility-result" key={`${result.query}-${index}`}><div className="visibility-result-title"><span>{String(index + 1).padStart(2, "0")}</span><h3>{result.query}</h3><b className={result.businessMentioned ? "is-mentioned" : result.answer ? "not-mentioned" : "is-unknown"}>{result.error || (result.businessMentioned ? "Αναφέρθηκε" : result.answer ? "Δεν εντοπίστηκε στην απάντηση" : "Δεν ολοκληρώθηκε")}</b></div>{result.answer && <p>{result.answer}</p>}{!!result.searchQueries.length && <details><summary>Ερωτήματα αναζήτησης που εκτελέστηκαν</summary><ul>{result.searchQueries.map((query) => <li key={query}>{query}</li>)}</ul></details>}{!!result.citations.length && <div className="visibility-citations"><strong>Πηγές</strong>{result.citations.map((citation) => <a key={citation.url} href={citation.url} target="_blank" rel="noreferrer">{citation.title} ↗</a>)}</div>}</article>)}</div></section>)}
    </section>}
  </>;
}
