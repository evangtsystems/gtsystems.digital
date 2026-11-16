"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import ContactVerification from "@/components/contact-verification";

type ChatMessage = { id: number; sender: "visitor" | "staff"; body: string; created_at: string };
const storageKey = "gtsystems-live-conversation";

export default function LiveChat({ apiUrl, siteKey, english, onBack }: { apiUrl: string; siteKey: string; english: boolean; onBack: () => void }) {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resuming, setResuming] = useState(true);
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [existingCustomer, setExistingCustomer] = useState<"" | "yes" | "no">("");
  const [verificationStep, setVerificationStep] = useState<"" | "vat" | "code">("");
  const [verified, setVerified] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const copy = english ? {
    name: "Your name", email: "Email (optional)", message: "How can we help?", start: "Start conversation", send: "Send", placeholder: "Write a message…", intro: "Send us a message and our team will reply here. If you leave an email, we can follow up if you leave the page.", notice: "Messages are saved so our team can respond. Please don't share passwords or sensitive details in the chat.", error: "Could not send your message. Please try again.", back: "← Assistant", offline: "We'll respond when a team member is available.", customer: "Are you an existing customer?", yes: "Yes", no: "No", vat: "VAT number (ΑΦΜ)", verify: "Verify customer identity", verifyStart: "Send verification code", sentCode: "If your details match a customer record with an email, a code has been sent to the address on file.", code: "Six-digit verification code", confirm: "Verify code", verificationError: "Verification failed or the code has expired. Please try again.", verified: "Customer identity verified", cancel: "Not now"
  } : {
    name: "Το όνομά σας", email: "Email (προαιρετικό)", message: "Πώς μπορούμε να βοηθήσουμε;", start: "Έναρξη συνομιλίας", send: "Αποστολή", placeholder: "Γράψτε ένα μήνυμα…", intro: "Στείλτε μας μήνυμα και η ομάδα μας θα σας απαντήσει εδώ. Αν αφήσετε email, μπορούμε να επικοινωνήσουμε μαζί σας και αργότερα.", notice: "Τα μηνύματα αποθηκεύονται για να μπορεί η ομάδα μας να απαντήσει. Μην κοινοποιείτε κωδικούς πρόσβασης ή ευαίσθητα στοιχεία στη συνομιλία.", error: "Το μήνυμα δεν στάλθηκε. Παρακαλούμε δοκιμάστε ξανά.", back: "← Βοηθός", offline: "Θα απαντήσουμε όταν είναι διαθέσιμο μέλος της ομάδας μας.", customer: "Είστε ήδη πελάτης μας;", yes: "Ναι", no: "Όχι", vat: "ΑΦΜ επιχείρησης", verify: "Επιβεβαίωση πελάτη", verifyStart: "Αποστολή κωδικού", sentCode: "Αν τα στοιχεία αντιστοιχούν σε πελάτη με καταχωρημένο email, έχει σταλεί κωδικός στη διεύθυνση που έχουμε στο αρχείο μας.", code: "Εξαψήφιος κωδικός επιβεβαίωσης", confirm: "Επιβεβαίωση κωδικού", verificationError: "Η επιβεβαίωση απέτυχε ή ο κωδικός έληξε. Δοκιμάστε ξανά.", verified: "Επιβεβαιωμένος πελάτης", cancel: "Όχι τώρα"
  };

  const refresh = useCallback(async (value: string) => {
    const response = await fetch(`${apiUrl}/api/conversation`, { headers: { Authorization: `Bearer ${value}` }, cache: "no-store" });
    if (response.status === 401) { sessionStorage.removeItem(storageKey); setToken(""); setMessages([]); return; }
    if (!response.ok) throw new Error("Conversation unavailable");
    const data: { messages: ChatMessage[]; verified: boolean } = await response.json();
    setVerified(data.verified);
    setMessages(current => current.length === data.messages.length && current.every((message, index) => message.id === data.messages[index].id) ? current : data.messages);
    setError("");
  }, [apiUrl]);

  useEffect(() => { const saved = sessionStorage.getItem(storageKey) || ""; setToken(saved); setResuming(false); }, []);
  useEffect(() => {
    if (!token) return;
    let active = true;
    const load = () => refresh(token).catch(() => { if (active) setError(english ? "Connection interrupted. Reconnecting…" : "Η σύνδεση διακόπηκε. Επανασύνδεση…"); });
    load(); const timer = window.setInterval(load, 3000);
    return () => { active = false; window.clearInterval(timer); };
  }, [token, refresh, english]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages]);

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setError("");
    try {
      const response = await fetch(`${apiUrl}/api/conversations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), message: data.get("message"), turnstile: data.get("cf-turnstile-response") }) });
      if (!response.ok) throw new Error("Unable to create conversation");
      const result: { token: string } = await response.json(); sessionStorage.setItem(storageKey, result.token); setToken(result.token);
      if (existingCustomer === "yes") {
        try { await requestVerification(result.token, String(data.get("vat") || "")); }
        catch { setError(copy.verificationError); setVerificationStep("vat"); }
      }
    } catch { setError(copy.error); setVerificationAttempt(attempt => attempt + 1); } finally { setBusy(false); }
  }

  async function requestVerification(conversationToken: string, vat: string) {
    const response = await fetch(`${apiUrl}/api/conversation/verification/start`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${conversationToken}` }, body: JSON.stringify({ vat, locale: english ? "en" : "el" }) });
    if (!response.ok) throw new Error("Verification unavailable");
    setVerificationStep("code"); setError("");
  }

  async function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setError("");
    try {
      if (verificationStep === "vat") await requestVerification(token, String(data.get("vat") || ""));
      else {
        const response = await fetch(`${apiUrl}/api/conversation/verification/confirm`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: data.get("code") }) });
        if (!response.ok) throw new Error("Verification failed");
        setVerified(true); setVerificationStep("");
      }
    } catch { setError(copy.verificationError); } finally { setBusy(false); }
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const message = draft.trim(); if (!message || busy) return; setBusy(true); setError("");
    try {
      const response = await fetch(`${apiUrl}/api/conversation/messages`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) });
      if (!response.ok) throw new Error("Unable to send"); setDraft(""); await refresh(token);
    } catch { setError(copy.error); } finally { setBusy(false); }
  }

  return <>
    <div className="live-chat__heading"><button type="button" onClick={onBack}>{copy.back}</button><span>{copy.offline}</span></div>
    {resuming ? null : token ? <>
      <div className="live-chat__verification">
        {verified ? <span className="live-chat__verified">✓ {copy.verified}</span> : verificationStep ? <form onSubmit={submitVerification}>
          {verificationStep === "code" && <p>{copy.sentCode}</p>}
          <label>{verificationStep === "vat" ? copy.vat : copy.code}<input name={verificationStep} inputMode="numeric" pattern={verificationStep === "vat" ? "[0-9]{9}" : "[0-9]{6}"} maxLength={verificationStep === "vat" ? 9 : 6} autoComplete="off" required /></label>
          <div><button type="submit" disabled={busy}>{verificationStep === "vat" ? copy.verifyStart : copy.confirm}</button><button type="button" onClick={() => { setVerificationStep(""); setError(""); }}>{copy.cancel}</button></div>
          {verificationStep === "code" && <button type="button" onClick={() => setVerificationStep("vat")}>{english ? "Request a new code" : "Νέος κωδικός"}</button>}
        </form> : <button type="button" onClick={() => setVerificationStep("vat")}>{copy.verify} ↗</button>}
      </div>
      <div className="chatbot__messages" aria-live="polite">
        {messages.map(message => <div className={`chatbot__message chatbot__message--${message.sender === "staff" ? "assistant" : "visitor"}`} key={message.id}>{message.body}</div>)}
        <div ref={end} />
      </div>
      <form className="chatbot__form" onSubmit={send}><label className="sr-only" htmlFor="live-chat-message">{copy.placeholder}</label><input id="live-chat-message" value={draft} onChange={event => setDraft(event.target.value)} placeholder={copy.placeholder} maxLength={2000} /><button type="submit" disabled={busy || !draft.trim()}>{copy.send}</button></form>
    </> : <form className="live-chat__start" onSubmit={start}>
      <p>{copy.intro}</p>
      <label>{copy.name}<input name="name" required maxLength={100} /></label>
      <label>{copy.email}<input name="email" type="email" maxLength={180} /></label>
      <fieldset className="live-chat__customer"><legend>{copy.customer}</legend><label><input type="radio" name="existing" value="yes" checked={existingCustomer === "yes"} onChange={() => setExistingCustomer("yes")} required /> {copy.yes}</label><label><input type="radio" name="existing" value="no" checked={existingCustomer === "no"} onChange={() => setExistingCustomer("no")} /> {copy.no}</label></fieldset>
      {existingCustomer === "yes" && <label>{copy.vat}<input name="vat" inputMode="numeric" pattern="[0-9]{9}" maxLength={9} autoComplete="off" required /></label>}
      <label>{copy.message}<textarea name="message" required maxLength={2000} /></label>
      <p className="live-chat__notice">{copy.notice}</p>
      <fieldset disabled={busy}><ContactVerification key={verificationAttempt} siteKey={siteKey} english={english} submitLabel={copy.start} /></fieldset>
    </form>}
    {error && <p role="alert" className="live-chat__error">{error}</p>}
  </>;
}
