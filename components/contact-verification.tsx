"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
    "response-field": boolean;
    theme: "auto";
  }) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

export default function ContactVerification({ siteKey, english = false }: { siteKey: string; english?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!loaded || !siteKey || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    const widgetId = api.render(container.current, {
      sitekey: siteKey,
      theme: "auto",
      "response-field": false,
      callback: (value) => { setToken(value); setFailed(false); },
      "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setFailed(true); },
    });
    return () => { api.remove(widgetId); };
  }, [loaded, siteKey]);

  return <>
    {siteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setLoaded(true)} onError={() => setFailed(true)} /> : null}
    <div ref={container} />
    <input type="hidden" name="cf-turnstile-response" value={token} />
    {(!siteKey || failed) && <p role="alert">{english ? "Verification is unavailable. Please try again or contact us by email." : "Η επιβεβαίωση δεν είναι διαθέσιμη. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας με email."}</p>}
    <button className="button" type="submit" disabled={!token}>{english ? "Send Request" : "Αποστολή αιτήματος"}</button>
  </>;
}
