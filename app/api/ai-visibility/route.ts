import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Citation = { title: string; url: string };
type QueryResult = {
  query: string;
  answer: string;
  searchQueries: string[];
  citations: Citation[];
  businessMentioned: boolean;
  error?: string;
};

const MODEL = process.env.AI_VISIBILITY_MODEL || "gemini-2.5-flash";
const queryTemplates = [
  "Ποιες επιχειρήσεις προτείνεις για {service} στην περιοχή {area}; Δώσε σύντομη λίστα με πραγματικές επιχειρήσεις και πηγές.",
  "Αν κάποιος στην περιοχή {area} χρειάζεται {service}, ποιες τοπικές επιχειρήσεις αξίζει να εξετάσει και γιατί; Παράθεσε πηγές.",
  "Βρες τρεις επιχειρήσεις που παρέχουν {service} και εξυπηρετούν την περιοχή {area}. Προτίμησε στοιχεία από ανεξάρτητες ή επίσημες πηγές.",
  "Ποιοι είναι οι αξιόπιστοι πάροχοι για {service} στην περιοχή {area}; Ανέφερε ονόματα και τις πηγές που τεκμηριώνουν την απάντηση.",
  "Σύγκρινε διαθέσιμες επιλογές για {service} στην περιοχή {area} και πρότεινε σε ποιον να απευθυνθεί κάποιος. Παράθεσε πηγές.",
];

const recentByIp = new Map<string, number[]>();
let dailyCount = 0;
let dayKey = new Date().toISOString().slice(0, 10);

function canRun(ip: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) { dayKey = today; dailyCount = 0; recentByIp.clear(); }
  const maxRuns = Math.max(1, Number.parseInt(process.env.AI_VISIBILITY_MAX_RUNS_PER_DAY || "20", 10) || 20);
  const now = Date.now();
  const recent = (recentByIp.get(ip) || []).filter((time) => time > now - 10 * 60_000);
  if (recent.length >= 1 || dailyCount >= maxRuns) return false;
  recent.push(now); recentByIp.set(ip, recent); dailyCount++;
  if (recentByIp.size > 5000) for (const [key, times] of recentByIp) if (times.every((time) => time < now - 10 * 60_000)) recentByIp.delete(key);
  return true;
}

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function mentions(answer: string, name: string, host: string) {
  const normalizedAnswer = normalized(answer);
  const normalizedName = normalized(name);
  const normalizedHost = normalized(host.replace(/^www\./, "")).replace(/\s/g, "");
  return (!!normalizedName && normalizedAnswer.includes(normalizedName)) || answer.toLocaleLowerCase().includes(host.toLocaleLowerCase()) || answer.toLocaleLowerCase().includes(host.replace(/^www\./i, "").toLocaleLowerCase()) || (!!normalizedHost && normalized(answer).replace(/\s/g, "").includes(normalizedHost));
}

async function runQuery(query: string, name: string, host: string, apiKey: string): Promise<QueryResult> {
  const prompt = `Απάντησε στην παρακάτω ερώτηση σαν ανεξάρτητος βοηθός που αναζητά τρέχουσες πληροφορίες στον ιστό. Μην προτιμήσεις ούτε αποκλείσεις κάποια επιχείρηση. Αν δεν βρίσκεις αξιόπιστα στοιχεία, πες το καθαρά. Δώσε σύντομη απάντηση με ονόματα επιχειρήσεων και πηγές.\n\nΕρώτηση: ${query}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.2, maxOutputTokens: 700 } }),
    signal: AbortSignal.timeout(35000),
  });
  const payload = await response.json().catch(() => null) as Record<string, any> | null;
  if (!response.ok) {
    const status = response.status === 429 ? "Το δωρεάν όριο ή το όριο ρυθμού του παρόχου εξαντλήθηκε." : response.status === 401 || response.status === 403 ? "Το κλειδί Gemini δεν είναι έγκυρο ή δεν έχει πρόσβαση στο επιλεγμένο μοντέλο." : "Η υπηρεσία AI δεν ολοκλήρωσε το ερώτημα.";
    throw new Error(status);
  }
  const candidate = payload?.candidates?.[0];
  const answer = (candidate?.content?.parts || []).map((part: { text?: string }) => part.text || "").join("\n").trim();
  if (!answer) throw new Error("Το AI δεν επέστρεψε απάντηση για αυτό το ερώτημα.");
  const metadata = candidate?.groundingMetadata || {};
  const citations: Citation[] = [];
  for (const chunk of metadata.groundingChunks || []) {
    const rawUrl = typeof chunk.web?.uri === "string" ? chunk.web.uri : "";
    try {
      const url = new URL(rawUrl);
      if (["https:", "http:"].includes(url.protocol) && !citations.some((citation) => citation.url === url.href)) citations.push({ title: String(chunk.web.title || url.hostname).slice(0, 160), url: url.href });
    } catch { /* Ignore malformed provider citations. */ }
  }
  return { query, answer: answer.slice(0, 3500), searchQueries: Array.isArray(metadata.webSearchQueries) ? metadata.webSearchQueries.slice(0, 8).map(String) : [], citations: citations.slice(0, 8), businessMentioned: mentions(answer, name, host) };
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 413 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 403 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Η υπηρεσία ορατότητας AI δεν έχει ρυθμιστεί ακόμη." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const service = typeof body.service === "string" ? body.service.replace(/\s+/g, " ").trim().slice(0, 120) : "";
    const area = typeof body.area === "string" ? body.area.replace(/\s+/g, " ").trim().slice(0, 120) : "";
    const website = typeof body.website === "string" ? body.website.trim().slice(0, 253) : "";
    if (name.length < 2 || service.length < 2 || area.length < 2 || !website) throw new Error("Συμπληρώστε όνομα επιχείρησης, site, υπηρεσία και περιοχή.");
    const simpleText = /^[\p{L}\p{N} .,'’&+()\/-]+$/u;
    if (!simpleText.test(service) || !simpleText.test(area)) throw new Error("Η υπηρεσία και η περιοχή πρέπει να περιέχουν μόνο ονόματα και συνηθισμένα σημεία στίξης.");
    const parsed = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
    if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.port && !["80", "443"].includes(parsed.port) || parsed.hostname === "localhost" || parsed.hostname.endsWith(".local") || !parsed.hostname.includes(".")) throw new Error("Πληκτρολογήστε δημόσιο site με έγκυρο domain.");
    if (!canRun(ip)) return NextResponse.json({ error: "Έχει ήδη εκτελεστεί έλεγχος από αυτή τη σύνδεση ή συμπληρώθηκε το ημερήσιο όριο. Προσπαθήστε ξανά αργότερα." }, { status: 429 });
    const host = parsed.hostname.replace(/^www\./i, "");
    const queries = queryTemplates.map((template) => template.replaceAll("{service}", service).replaceAll("{area}", area));
    const settled = await Promise.allSettled(queries.map((query) => runQuery(query, name, host, apiKey)));
    const results = settled.map((item, index) => item.status === "fulfilled" ? item.value : ({ query: queries[index], answer: "", searchQueries: [], citations: [], businessMentioned: false, error: item.reason instanceof Error ? item.reason.message : "Το ερώτημα δεν ολοκληρώθηκε." }));
    if (!results.some((result) => result.answer)) return NextResponse.json({ error: results[0]?.error || "Δεν ήταν δυνατή η ολοκλήρωση του ελέγχου." }, { status: 502 });
    return NextResponse.json({ name, website: parsed.origin, area, service, checkedAt: new Date().toISOString(), model: MODEL, provider: "Gemini με Αναζήτηση Google", results, completed: results.filter((result) => result.answer).length, mentions: results.filter((result) => result.businessMentioned).length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Δεν ήταν δυνατή η ολοκλήρωση του ελέγχου.";
    return NextResponse.json({ error: message }, { status: message.startsWith("Συμπληρώστε") || message.startsWith("Πληκτρολογήστε") ? 400 : 502 });
  }
}
