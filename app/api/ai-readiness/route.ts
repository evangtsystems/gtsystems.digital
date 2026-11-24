import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import * as ipaddr from "ipaddr.js";
import robotsParser from "robots-parser";
import * as cheerio from "cheerio";
import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Some CMS homepages contain substantial inline page-builder markup.
// Keep a bounded response size while accepting normal public sites.
const MAX_BYTES = 2_000_000;
const MAX_PAGES = 6;
const agent = "GTSystemsReadinessBot";
type Result = { status: number; url: string; body: string; type: string; location?: string; headers: Record<string, string | string[] | undefined> };
type Finding = { title: string; status: "found" | "review" | "unknown"; detail: string; evidence?: string; url?: string };

type Rendered = { title: string; h1: string; canonical: string; text: string; headings: string[]; links: string[]; schemas: string[]; description: string; };

async function renderPage(home: Result): Promise<Rendered> {
  const browserCache = join(homedir(), ".cache", "ms-playwright");
  const cachedChromium = existsSync(browserCache) ? readdirSync(browserCache, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^chromium-\d+$/.test(entry.name)).map((entry) => join(browserCache, entry.name, "chrome-linux64", "chrome")) : [];
  const candidates = [process.env.AUDIT_BROWSER_PATH, ...cachedChromium, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].filter((path): path is string => !!path);
  const executablePath = candidates.find(existsSync);
  if (!executablePath) throw new Error("Browser unavailable");
  const browser = await chromium.launch({ executablePath, headless: true, args: ["--disable-quic", "--disable-background-networking", "--disable-webrtc", "--no-proxy-server"] });
  try {
    const context = await browser.newContext({ serviceWorkers: "block", javaScriptEnabled: true });
    await context.routeWebSocket("**/*", socket => socket.close());
    let requests = 0;
    await context.route("**/*", async route => {
      const request = route.request();
      if (request.method() !== "GET" || !["document", "script", "stylesheet"].includes(request.resourceType()) || ++requests > 35) return route.abort();
      if (request.isNavigationRequest() && request.url() !== home.url) return route.abort();
      try {
        const response = request.url() === home.url ? home : await fetchPublic(request.url());
        if (request.resourceType() !== "document" && !/javascript|ecmascript|text\/css/i.test(response.type)) return route.abort();
        await route.fulfill({ status: response.status, contentType: response.type || "text/html; charset=utf-8", body: response.body });
      } catch { await route.abort().catch(() => {}); }
    });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(12000);
    await page.goto(home.url, { waitUntil: "load" }).catch(async () => { if (page.url() !== home.url) throw new Error("Render failed"); });
    await page.waitForTimeout(1500);
    const result = await page.evaluate(() => {
      const visible = (el: Element) => { const style = getComputedStyle(el); return style.display !== "none" && style.visibility !== "hidden" && !!el.getClientRects().length; };
      const main = document.querySelector("main") ?? document.body;
      return {
        title: document.title,
        h1: Array.from(document.querySelectorAll("h1")).filter(visible).map(el => el.textContent?.trim() ?? "").find(Boolean) ?? "",
        canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "",
        description: document.querySelector<HTMLMetaElement>('meta[name="description" i]')?.content ?? "",
        text: (main.innerText ?? "").replace(/\s+/g," ").slice(0,12000),
        headings: Array.from(main.querySelectorAll("h1,h2,h3")).filter(visible).slice(0,25).map(el => (el.textContent ?? "").trim().slice(0,160)),
        links: Array.from(main.querySelectorAll<HTMLAnchorElement>("a[href]")).filter(visible).slice(0,40).map(el => `${el.textContent?.trim().slice(0,60) || "[χωρίς ορατό κείμενο]"}: ${el.href}`).filter(x => /^.+: https?:\/\//.test(x)),
        schemas: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).slice(0,20).map(el => (el.textContent ?? "").slice(0,100000)),
      };
    });
    await context.close(); return result;
  } finally { await browser.close(); }
}

async function pageSpeed(url: string) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url); endpoint.searchParams.set("strategy", "mobile");
  if (process.env.PAGESPEED_API_KEY) endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  for (const category of ["performance", "accessibility", "seo", "best-practices"]) endpoint.searchParams.append("category", category);
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data.error || !data.lighthouseResult?.categories) throw new Error("Incomplete report");
  const lh = data.lighthouseResult;
  return { categories: Object.fromEntries(Object.entries(lh.categories as Record<string, { score: number | null }>).map(([name, value]) => [name, value.score === null ? null : Math.round(value.score * 100)])), metrics: Object.fromEntries(["largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"].map(key => [key, lh.audits?.[key]?.displayValue ?? null])), finalUrl: lh.finalDisplayedUrl ?? url };
}

function publicAddress(address: string) {
  try {
    let parsed = ipaddr.parse(address);
    if (parsed.kind() === "ipv6" && (parsed as ipaddr.IPv6).isIPv4MappedAddress()) parsed = (parsed as ipaddr.IPv6).toIPv4Address();
    return parsed.range() === "unicast";
  } catch { return false; }
}

async function fetchPublic(input: string, redirects = 0): Promise<Result> {
  if (redirects > 3) throw new Error("Πάρα πολλές ανακατευθύνσεις.");
  const url = new URL(input);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || (url.port && !["80", "443"].includes(url.port))) throw new Error("Μη επιτρεπτή διεύθυνση.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || isIP(host)) throw new Error("Επιτρέπονται μόνο δημόσια domains.");
  const addresses = await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => !publicAddress(address))) throw new Error("Η διεύθυνση δεν είναι δημόσια.");
  const address = addresses[0];
  const result = await new Promise<Result>((resolve, reject) => {
    const req = (url.protocol === "https:" ? httpsRequest : httpRequest)(url, {
      method: "GET", family: address.family, headers: { "user-agent": `${agent}/1.0`, accept: "text/html,application/xhtml+xml,text/plain,application/xml;q=0.9,*/*;q=0.1" },
      lookup: ((_hostname: string, _options: unknown, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => callback(null, address.address, address.family)) as never,
      timeout: 8000,
    }, (res) => {
      const chunks: Buffer[] = []; let size = 0;
      res.on("data", (chunk: Buffer) => { size += chunk.length; if (size > MAX_BYTES) req.destroy(new Error("Η σελίδα είναι πολύ μεγάλη για τον έλεγχο.")); else chunks.push(chunk); });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, url: url.href, body: Buffer.concat(chunks).toString("utf8"), type: String(res.headers["content-type"] ?? ""), location: res.headers.location, headers: res.headers }));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("Η σύνδεση έληξε."))); req.on("error", reject); req.end();
  });
  if ([301, 302, 303, 307, 308].includes(result.status) && result.location) return fetchPublic(new URL(result.location, url).href, redirects + 1);
  return result;
}

const rate = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  if (rate.size > 5000) for (const [k, times] of rate) if (times.every(t => t < now - 60000)) rate.delete(k);
  const recent = (rate.get(key) ?? []).filter(t => t > now - 60000);
  if (recent.length >= 4 || rate.size > 5000) return true;
  recent.push(now); rate.set(key, recent); return false;
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 2048) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 413 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 403 });
  const key = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(key)) return NextResponse.json({ error: "Πολλοί έλεγχοι. Προσπαθήστε ξανά σε ένα λεπτό." }, { status: 429 });
  try {
    const payload = await req.json();
    const input = typeof payload.domain === "string" ? payload.domain.trim() : "";
    if (!input || input.length > 253) throw new Error("Πληκτρολογήστε ένα έγκυρο domain.");
    const u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (u.pathname !== "/" || u.search || u.hash) throw new Error("Πληκτρολογήστε μόνο το domain, χωρίς διαδρομή.");
    const home = await fetchPublic(u.origin + "/");
    if (home.status !== 200 || !/html/i.test(home.type)) throw new Error(`Η αρχική σελίδα δεν επέστρεψε προσβάσιμο HTML (HTTP ${home.status}).`);
    const renderedJob = renderPage(home).then(value => ({ value, error: false })).catch(() => ({ value: null, error: true }));
    const performanceJob = pageSpeed(home.url).then(value => ({ value, reason: "" })).catch((error: unknown) => ({ value: null, reason: error instanceof Error && error.message === "HTTP 429" ? "Η Google επέστρεψε όριο χρήσης (HTTP 429)." : "Η υπηρεσία δεν απάντησε ή η ανάλυση δεν ολοκληρώθηκε." }));
    const root = new URL(home.url); const base = root.origin;
    const robotsUrl = `${base}/robots.txt`;
    let robots: ReturnType<typeof robotsParser> | null = null;
    let robotsStatus = "";
    try {
      const r = await fetchPublic(robotsUrl);
      if (new URL(r.url).origin !== base) { robotsStatus = "Το robots.txt ανακατευθύνεται εκτός του ιστότοπου· δεν αξιολογήθηκε."; }
      else if (r.status === 200 && r.body.length <= MAX_BYTES) { robots = robotsParser(robotsUrl, r.body); robotsStatus = "Το robots.txt διαβάστηκε."; }
      else if (r.status === 404 || r.status === 410) { robots = robotsParser(robotsUrl, ""); robotsStatus = `Δεν βρέθηκε robots.txt (HTTP ${r.status}).`; }
      else robotsStatus = `Δεν ήταν δυνατή η αξιολόγηση του robots.txt (HTTP ${r.status}).`;
    } catch { robotsStatus = "Δεν ήταν δυνατή η ανάγνωση του robots.txt."; }
    const findings: Finding[] = [];
    findings.push({ title: "Αρχική σελίδα", status: "found", detail: `Η αρχική επέστρεψε HTML με HTTP ${home.status}.`, url: home.url });
    for (const bot of ["OAI-SearchBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Googlebot"]) {
      const allowed = robots?.isAllowed(home.url, bot);
      findings.push({ title: `${bot} · robots.txt`, status: allowed === true ? "found" : allowed === false ? "review" : "unknown", detail: allowed === true ? "Οι κανόνες επιτρέπουν την αρχική σελίδα. Αυτό δεν επιβεβαιώνει πρόσβαση από το δίκτυο ή ευρετηρίαση." : allowed === false ? "Οι κανόνες αποκλείουν την αρχική σελίδα για αυτόν τον crawler." : robotsStatus, url: robotsUrl });
    }
    const $ = cheerio.load(home.body); const candidates: string[] = [];
    $("a[href]").each((_, el) => {
      if (candidates.length >= 40) return;
      try { const href = $(el).attr("href"); if (!href) return; const link = new URL(href, home.url); link.hash = ""; link.search = ""; if (link.origin === base && link.pathname !== "/" && !/\.(pdf|jpg|png|svg|zip|webp|xml)$/i.test(link.pathname) && !candidates.includes(link.href)) candidates.push(link.href); } catch { /* ignore invalid links */ }
    });
    const rankLink = (link: string) => { const path = new URL(link).pathname; return /service|solution|business|support|web|system/i.test(path) ? 2 : /contact|about|company/i.test(path) ? 1 : 0; };
    candidates.sort((a,b) => rankLink(b) - rankLink(a));
    const pages = [home];
    // Different links can redirect to the same final URL (including the homepage).
    const visited = new Set([new URL(home.url).href]);
    let skipped = 0;
    if (robots) for (const candidate of candidates) {
      if (pages.length >= MAX_PAGES) break;
      if (robots.isAllowed(candidate, agent) !== true) { skipped++; continue; }
      try {
        const page = await fetchPublic(candidate);
        const finalUrl = new URL(page.url);
        finalUrl.hash = "";
        if (finalUrl.origin !== base || robots.isAllowed(finalUrl.href, agent) !== true || page.status !== 200 || !/html/i.test(page.type)) { skipped++; continue; }
        if (visited.has(finalUrl.href)) continue;
        visited.add(finalUrl.href);
        pages.push({ ...page, url: finalUrl.href });
      } catch { skipped++; }
    }
    for (const page of pages) {
      const doc = cheerio.load(page.body);
      const title = doc("title").first().text().trim();
      const description = doc('meta[name="description" i]').attr("content")?.trim();
      const h1 = doc("h1").first().text().replace(/\s+/g," ").trim();
      const noindex = [doc('meta[name="robots" i]').attr("content"), page.headers["x-robots-tag"]].flat().filter(Boolean).join(" ");
      const canonical = doc('link[rel~="canonical" i]').first().attr("href");
      let canonicalUrl = "";
      try { if (canonical) canonicalUrl = new URL(canonical, page.url).href; } catch { /* invalid URL is flagged below */ }
      findings.push({ title: `Τίτλος · ${new URL(page.url).pathname}`, status: title ? "found" : "review", detail: title ? "Βρέθηκε τίτλος σελίδας." : "Δεν βρέθηκε τίτλος στο HTML.", evidence: title?.slice(0, 200), url: page.url });
      findings.push({ title: `Κύρια επικεφαλίδα · ${new URL(page.url).pathname}`, status: h1 ? "found" : "review", detail: h1 ? "Βρέθηκε επικεφαλίδα H1." : "Δεν βρέθηκε H1 στο αρχικό HTML.", evidence: h1?.slice(0, 200), url: page.url });
      if (page.url === home.url && title && h1) {
        const tokens = (s: string): string[] => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("el").match(/[\p{L}\p{N}]{5,}/gu) ?? [];
        const titleTokens = tokens(title); const headlineTokens = tokens(h1);
        if (titleTokens.length && headlineTokens.length && !headlineTokens.some(word => titleTokens.includes(word))) findings.push({ title: "Σαφήνεια αρχικής επικεφαλίδας · χειροκίνητος έλεγχος", status: "review", detail: "Η επικεφαλίδα και ο τίτλος δεν μοιράζονται λέξεις 5+ χαρακτήρων. Αυτό δεν είναι σφάλμα ή παράγοντας κατάταξης· ελέγξτε αν η επικεφαλίδα εξηγεί σε έναν νέο επισκέπτη τι προσφέρει η επιχείρηση.", evidence: `H1: ${h1.slice(0, 160)} | Τίτλος: ${title.slice(0, 160)}`, url: page.url });
      }
      findings.push({ title: `Οδηγία ευρετηρίασης · ${new URL(page.url).pathname}`, status: /noindex/i.test(noindex) ? "review" : "found", detail: /noindex/i.test(noindex) ? "Βρέθηκε οδηγία noindex. Ελέγξτε αν είναι σκόπιμη." : "Δεν εντοπίστηκε γενική οδηγία noindex στο αρχικό HTML ή στην απόκριση. Αυτό δεν επιβεβαιώνει ευρετηρίαση.", evidence: noindex.slice(0, 200) || undefined, url: page.url });
      findings.push({ title: `Περιγραφή · ${new URL(page.url).pathname}`, status: description ? "found" : "review", detail: description ? "Βρέθηκε meta description στο αρχικό HTML." : "Δεν βρέθηκε meta description στο αρχικό HTML.", evidence: description?.slice(0, 200), url: page.url });
      findings.push({ title: `Canonical · ${new URL(page.url).pathname}`, status: canonicalUrl ? "found" : "review", detail: canonicalUrl ? "Δηλωμένη canonical διεύθυνση στο αρχικό HTML. Η Google μπορεί να επιλέξει διαφορετική." : "Δεν βρέθηκε έγκυρη canonical διεύθυνση στο αρχικό HTML. Η απουσία της δεν σημαίνει απαραίτητα πρόβλημα.", evidence: canonicalUrl || canonical, url: page.url });
      const path = new URL(page.url).pathname;
      const lang = doc("html").attr("lang")?.trim();
      findings.push({ title: `Γλώσσα HTML · ${path}`, status: lang ? "found" : "review", detail: lang ? "Βρέθηκε δήλωση γλώσσας HTML. Η ορθότητά της χρειάζεται επιβεβαίωση." : "Δεν βρέθηκε δήλωση γλώσσας στο στοιχείο HTML.", evidence: lang, url: page.url });
      const viewport = doc('meta[name="viewport" i]').attr("content")?.trim();
      findings.push({ title: `Viewport · ${path}`, status: viewport ? "found" : "review", detail: viewport ? "Βρέθηκε δήλωση viewport. Αυτό δεν επιβεβαιώνει ότι η σελίδα είναι πλήρως φιλική σε κινητά." : "Δεν βρέθηκε δήλωση viewport στο αρχικό HTML.", evidence: viewport, url: page.url });
      const images = doc("img").toArray();
      const missingAlt = images.filter(el => doc(el).attr("alt") === undefined).length;
      findings.push({ title: `Εναλλακτικό κείμενο εικόνων · ${path}`, status: missingAlt ? "review" : "found", detail: missingAlt ? `${missingAlt} από ${images.length} εικόνες δεν έχουν καθόλου χαρακτηριστικό alt. Διακοσμητικές εικόνες μπορούν να έχουν κενό alt.` : `Δεν βρέθηκαν εικόνες χωρίς χαρακτηριστικό alt στο αρχικό HTML (${images.length} εικόνες). Η ποιότητα των περιγραφών δεν αξιολογήθηκε.`, url: page.url });
      const duplicateTitles = title ? pages.filter(other => cheerio.load(other.body)("title").first().text().trim().toLocaleLowerCase() === title.toLocaleLowerCase()).length : 0;
      findings.push({ title: `Μοναδικότητα τίτλου · ${path}`, status: !title ? "unknown" : duplicateTitles > 1 ? "review" : "found", detail: !title ? "Χωρίς τίτλο δεν μπορεί να γίνει σύγκριση." : duplicateTitles > 1 ? `Ο ίδιος τίτλος βρέθηκε σε ${duplicateTitles} από τις σελίδες του δείγματος.` : "Ο τίτλος είναι μοναδικός μεταξύ των σελίδων του δείγματος.", evidence: title?.slice(0, 200), url: page.url });
    }
    const renderedResult = await renderedJob;
    const rendered = renderedResult.value;
    const initialH1 = $("h1").first().text().replace(/\s+/g, " ").trim();
    if (rendered) {
      findings.push({ title: "Απόδοση JavaScript · αρχική", status: "found", detail: "Η αρχική φορτώθηκε σε απομονωμένο browser με JavaScript. Η πρόσβαση των crawler και η ευρετηρίαση δεν επιβεβαιώνονται από αυτόν τον έλεγχο.", evidence: `Αρχική H1: ${initialH1 || "δεν βρέθηκε"} | Μετά την απόδοση: ${rendered.h1 || "δεν βρέθηκε ορατή H1"}`, url: home.url });
      findings.push({ title: "Ορατό περιεχόμενο · αρχική", status: rendered.text ? "found" : "unknown", detail: rendered.text ? "Απόσπασμα κειμένου που επιστρέφει το αποδοσμένο περιεχόμενο. Ελέγξτε χειροκίνητα αν δηλώνονται με σαφήνεια επιχείρηση, υπηρεσίες, περιοχή και εμπειρία· η ποιότητά τους δεν βαθμολογείται αυτόματα." : "Δεν βρέθηκε κείμενο στο αποδοσμένο περιεχόμενο ή η απόδοση ήταν ελλιπής.", evidence: rendered.text.slice(0, 450), url: home.url });
      findings.push({ title: "Επικεφαλίδες και σύνδεσμοι · αρχική", status: "found", detail: `Εντοπίστηκαν ${rendered.headings.length} ορατές επικεφαλίδες και έως ${rendered.links.length} ορατοί σύνδεσμοι στο κύριο περιεχόμενο (μέγιστο δείγμα 25 και 40).`, evidence: `Επικεφαλίδες: ${rendered.headings.slice(0, 5).join(" | ") || "δεν βρέθηκαν"} · Σύνδεσμοι: ${rendered.links.slice(0, 3).join(" | ") || "δεν βρέθηκαν"}`, url: home.url });
      if (rendered.canonical) findings.push({ title: "Canonical μετά την απόδοση · αρχική", status: "found", detail: "Canonical που βρέθηκε μετά την εκτέλεση JavaScript. Η Google μπορεί να επιλέξει άλλη διεύθυνση.", evidence: rendered.canonical, url: home.url });
    } else findings.push({ title: "Απόδοση JavaScript · αρχική", status: "unknown", detail: "Η απόδοση σε browser δεν ολοκληρώθηκε. Τα ευρήματα περιορίζονται στο αρχικό HTML· δεν συμπεραίνουμε ότι το περιεχόμενο λείπει.", url: home.url });
    const schemas = rendered ? rendered.schemas : $("script[type='application/ld+json']").toArray().map(el => $(el).html() ?? "");
    let invalidSchemas = 0; const structured: Record<string, unknown>[] = [];
    const walk = (value: unknown, depth = 0) => { if (depth > 12 || structured.length > 100 || !value || typeof value !== "object") return; if (Array.isArray(value)) { for (const item of value) walk(item, depth + 1); return; } const object = value as Record<string, unknown>; if (object["@type"]) structured.push(object); for (const nested of Object.values(object)) if (nested && typeof nested === "object") walk(nested, depth + 1); };
    for (const raw of schemas) try { walk(JSON.parse(raw)); } catch { invalidSchemas++; }
    if (invalidSchemas) findings.push({ title: "Σύνταξη JSON-LD · αρχική", status: "review", detail: `Δεν ήταν δυνατή η ανάγνωση ${invalidSchemas} από ${schemas.length} μπλοκ JSON-LD ως JSON. Ελέγξτε τη σύνταξη.`, url: home.url });
    const business = structured.find(obj => (Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]]).some(type => typeof type === "string" && /(?:Organization|LocalBusiness|ProfessionalService|Store|Corporation|ITService|ComputerStore)$/i.test(type)));
    if (business) {
      const fields = ["@type", "name", "url", "telephone", "email", "address", "areaServed"].filter(k => business[k] != null).map(k => `${k}: ${typeof business[k] === "string" ? business[k] : JSON.stringify(business[k])}`).join(" | ");
      findings.push({ title: "Δομημένα δεδομένα επιχείρησης · αρχική", status: "found", detail: `Βρέθηκε JSON-LD ${rendered ? "μετά την απόδοση" : "στο αρχικό HTML"}. Ελέγχθηκε η σύνταξη JSON, όχι η πλήρης εγκυρότητα schema ή η αντιστοιχία με το ορατό περιεχόμενο.`, evidence: fields.slice(0, 900), url: home.url });
      if (typeof business.url === "string") try { const schemaUrl = new URL(business.url, home.url); if (schemaUrl.hostname !== root.hostname) findings.push({ title: "Διεύθυνση schema · χειροκίνητος έλεγχος", status: "review", detail: "Το URL της επιχείρησης στο schema έχει διαφορετικό hostname από τη σελίδα που ελέγχθηκε. Μπορεί να είναι σκόπιμο· ελέγξτε αν αντιστοιχεί στον σωστό επίσημο ιστότοπο.", evidence: `Σελίδα: ${home.url} | Schema: ${schemaUrl.href}`, url: home.url }); } catch { findings.push({ title: "Διεύθυνση schema · χειροκίνητος έλεγχος", status: "review", detail: "Το URL της επιχείρησης στο schema δεν είναι έγκυρη διεύθυνση.", evidence: business.url.slice(0, 300), url: home.url }); }
      if (rendered && typeof business.name === "string" && !rendered.text.toLocaleLowerCase("el").includes(business.name.toLocaleLowerCase("el"))) findings.push({ title: "Επωνυμία schema · χειροκίνητος έλεγχος", status: "review", detail: "Η ακριβής επωνυμία του schema δεν εντοπίστηκε στο κείμενο του κύριου περιεχομένου. Ελέγξτε αν εμφανίζεται σε άλλο ορατό σημείο ή αν χρησιμοποιείται διαφορετική νόμιμη/εμπορική επωνυμία. Αυτό δεν αποδεικνύει ασυμφωνία.", evidence: business.name, url: home.url });
    } else findings.push({ title: "Δομημένα δεδομένα επιχείρησης · αρχική", status: "unknown", detail: `Δεν εντοπίστηκε γνωστός τύπος επιχείρησης στο ${rendered ? "αποδοσμένο" : "αρχικό"} JSON-LD. Μπορεί να χρησιμοποιούνται άλλοι τύποι ή μορφές. Η απουσία schema δεν αποδεικνύει πρόβλημα AI search.`, evidence: `JSON-LD blocks: ${schemas.length} · τύποι: ${structured.map(x => JSON.stringify(x["@type"])).join(", ").slice(0, 400) || "κανένας"}`, url: home.url });
    // These are evidence for editorial review, not claims of ranking or GEO compliance.
    findings.push({ title: "Σαφήνεια περιεχομένου · δείγμα αρχικής", status: rendered?.text ? "review" : "unknown", detail: rendered?.text ? "Ελέγξτε αν το ορατό περιεχόμενο εξηγεί άμεσα τι προσφέρεται, σε ποιους και πού. Το απόσπασμα δεν αξιολογείται αυτόματα ως ποιοτικό ή πλήρες." : "Δεν ήταν διαθέσιμο το αποδοσμένο περιεχόμενο για αξιολόγηση.", evidence: rendered?.text.slice(0, 450), url: home.url });
    const schemaFields = ["name", "url", "telephone", "email", "address", "areaServed"];
    findings.push({ title: "Πεδία schema επιχείρησης · αρχική", status: business ? "review" : "unknown", detail: business ? "Καταγραφή ενδεικτικών πεδίων για χειροκίνητο έλεγχο. Δεν είναι όλα υποχρεωτικά για κάθε επιχείρηση και η παρουσία τους δεν πιστοποιεί εγκυρότητα schema." : "Δεν εντοπίστηκε αναγνωρισμένος τύπος επιχείρησης· η πληρότητα δεν μπορεί να αξιολογηθεί.", evidence: business ? `Παρόντα: ${schemaFields.filter(k => business[k] != null).join(", ") || "κανένα"} · Δεν εντοπίστηκαν: ${schemaFields.filter(k => business[k] == null).join(", ") || "κανένα"}` : undefined, url: home.url });
    findings.push({ title: "Συνέπεια στοιχείων επιχείρησης · αρχική", status: business && rendered ? "review" : "unknown", detail: business && rendered ? "Συγκρίνετε επωνυμία, URL και στοιχεία επικοινωνίας του schema με τα ορατά στοιχεία. Δεν επιβεβαιώνεται αυτόματα ότι περιγράφουν την ίδια επιχείρηση." : "Απαιτούνται αναγνωρισμένο schema επιχείρησης και αποδοσμένο περιεχόμενο για τη σύγκριση.", evidence: business ? ["name", "url", "telephone", "email"].filter(k => typeof business[k] === "string").map(k => `${k}: ${business[k]}`).join(" | ").slice(0, 600) : undefined, url: home.url });
    findings.push({ title: "Θεματική κάλυψη · δείγμα σελίδων", status: "review", detail: "Εξετάστε αν οι σελίδες καλύπτουν τις υπηρεσίες, περιοχές και ερωτήσεις των πελατών. Οι τίτλοι είναι μόνο δείγμα και δεν αποδεικνύουν πληρότητα ή κατάταξη.", evidence: pages.map(page => { const doc = cheerio.load(page.body); return `${new URL(page.url).pathname}: ${doc("title").first().text().trim().slice(0, 120) || "χωρίς τίτλο"}`; }).join(" | ").slice(0, 900), url: home.url });
    const performanceResult = await performanceJob;
    return NextResponse.json({ domain: base, checkedAt: new Date().toISOString(), pages: pages.map(p => p.url), skipped, robotsStatus, findings, performance: performanceResult.value, performanceReason: performanceResult.reason, rendering: rendered ? "complete" : "unavailable" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && /domain|διεύθυνση|σελίδα|ανακατευθύνσεις/.test(error.message) ? error.message : "Δεν μπορέσαμε να ολοκληρώσουμε τον έλεγχο. Ελέγξτε το domain και προσπαθήστε ξανά." }, { status: 400 });
  }
}
