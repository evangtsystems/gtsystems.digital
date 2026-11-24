import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Citation = { title: string; url: string };
type QueryResult = { query: string; answer: string; searchQueries: string[]; citations: Citation[]; businessMentioned: boolean; error?: string };
type Provider = { id: "gemini" | "openai" | "claude"; name: string; model: string; key: string };

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
  // Each run is five queries per enabled provider. Keep the default small while this is a trial.
  const maxRuns = Math.max(1, Number.parseInt(process.env.AI_VISIBILITY_MAX_RUNS_PER_DAY || "2", 10) || 2);
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
  return (!!normalizedName && normalizedAnswer.includes(normalizedName)) || answer.toLocaleLowerCase().includes(host.toLocaleLowerCase()) || answer.toLocaleLowerCase().includes(host.replace(/^www\./i, "").toLocaleLowerCase()) || (!!normalizedHost && normalizedAnswer.replace(/\s/g, "").includes(normalizedHost));
}

function safeCitations(citations: Citation[]) {
  const unique = new Map<string, Citation>();
  for (const citation of citations) {
    try {
      const url = new URL(citation.url);
      if (["https:", "http:"].includes(url.protocol)) unique.set(url.href, { title: String(citation.title || url.hostname).slice(0, 160), url: url.href });
    } catch { /* Ignore malformed provider citations. */ }
  }
  return [...unique.values()].slice(0, 8);
}

async function providerQuery(provider: Provider, query: string, name: string, host: string): Promise<QueryResult> {
  const prompt = `Απάντησε στην παρακάτω ερώτηση σαν ανεξάρτητος βοηθός που αναζητά τρέχουσες πληροφορίες στον ιστό. Μην προτιμήσεις ούτε αποκλείσεις κάποια επιχείρηση. Αν δεν βρίσκεις αξιόπιστα στοιχεία, πες το καθαρά. Δώσε σύντομη απάντηση με ονόματα επιχειρήσεων και πηγές.\n\nΕρώτηση: ${query}`;
  let answer = "";
  const citations: Citation[] = [];
  const searchQueries: string[] = [];

  if (provider.id === "gemini") {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}:generateContent`, {
      method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": provider.key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.2, maxOutputTokens: 700 } }), signal: AbortSignal.timeout(35000),
    });
    const payload = await response.json().catch(() => null) as Record<string, any> | null;
    if (!response.ok) throw new Error(providerError(response.status, "Gemini"));
    const candidate = payload?.candidates?.[0];
    answer = (candidate?.content?.parts || []).map((part: { text?: string }) => part.text || "").join("\n").trim();
    const grounding = candidate?.groundingMetadata || {};
    for (const chunk of grounding.groundingChunks || []) if (chunk.web?.uri) citations.push({ title: chunk.web.title || chunk.web.uri, url: chunk.web.uri });
    if (Array.isArray(grounding.webSearchQueries)) searchQueries.push(...grounding.webSearchQueries.map(String));
  } else if (provider.id === "openai") {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${provider.key}` },
      body: JSON.stringify({ model: provider.model, input: prompt, tools: [{ type: "web_search" }], tool_choice: "auto", max_output_tokens: 700 }), signal: AbortSignal.timeout(45000),
    });
    const payload = await response.json().catch(() => null) as Record<string, any> | null;
    if (!response.ok) throw new Error(providerError(response.status, "OpenAI"));
    for (const item of payload?.output || []) {
      if (item.type === "message") for (const block of item.content || []) {
        if (block.type === "output_text") {
          answer += `${block.text || ""}\n`;
          for (const annotation of block.annotations || []) if (annotation.type === "url_citation") citations.push({ title: annotation.title || annotation.url, url: annotation.url });
        }
      }
      if (item.type === "web_search_call" && item.action?.query) searchQueries.push(String(item.action.query));
    }
    answer = answer.trim();
  } else {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "content-type": "application/json", "x-api-key": provider.key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: provider.model, max_tokens: 700, temperature: 0.2, messages: [{ role: "user", content: prompt }], tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 1 }] }), signal: AbortSignal.timeout(45000),
    });
    const payload = await response.json().catch(() => null) as Record<string, any> | null;
    if (!response.ok) throw new Error(providerError(response.status, "Claude"));
    for (const block of payload?.content || []) {
      if (block.type === "text") {
        answer += `${block.text || ""}\n`;
        for (const citation of block.citations || []) if (citation.url) citations.push({ title: citation.title || citation.url, url: citation.url });
      }
      if (block.type === "server_tool_use" && block.name === "web_search" && block.input?.query) searchQueries.push(String(block.input.query));
      if (block.type === "web_search_tool_result" && Array.isArray(block.content)) for (const item of block.content) if (item.url) citations.push({ title: item.title || item.url, url: item.url });
    }
    answer = answer.trim();
  }
  if (!answer) throw new Error("Το AI δεν επέστρεψε απάντηση για αυτό το ερώτημα.");
  return { query, answer: answer.slice(0, 3500), searchQueries: [...new Set(searchQueries)].slice(0, 8), citations: safeCitations(citations), businessMentioned: mentions(answer, name, host) };
}

function providerError(status: number, provider: string) {
  if (status === 429) return `Το όριο χρήσης του ${provider} API εξαντλήθηκε.`;
  if (status === 401 || status === 403) return `Το κλειδί ${provider} API δεν είναι έγκυρο ή δεν έχει πρόσβαση στο μοντέλο.`;
  return `Το ${provider} API δεν ολοκλήρωσε το ερώτημα.`;
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 413 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 403 });
  const providers: Provider[] = [
    ...(process.env.GEMINI_API_KEY ? [{ id: "gemini" as const, name: "Gemini με Αναζήτηση Google", model: process.env.AI_VISIBILITY_GEMINI_MODEL || process.env.AI_VISIBILITY_MODEL || "gemini-2.5-flash", key: process.env.GEMINI_API_KEY }] : []),
    ...(process.env.OPENAI_API_KEY ? [{ id: "openai" as const, name: "ChatGPT με Αναζήτηση Ιστού", model: process.env.AI_VISIBILITY_OPENAI_MODEL || "gpt-4.1-mini", key: process.env.OPENAI_API_KEY }] : []),
    ...(process.env.ANTHROPIC_API_KEY ? [{ id: "claude" as const, name: "Claude με Αναζήτηση Ιστού", model: process.env.AI_VISIBILITY_CLAUDE_MODEL || "claude-sonnet-4-5", key: process.env.ANTHROPIC_API_KEY }] : []),
  ];
  if (!providers.length) return NextResponse.json({ error: "Δεν έχει ρυθμιστεί κανένας πάροχος AI στον server." }, { status: 503 });
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
    if (!canRun(ip)) return NextResponse.json({ error: "Έχει ήδη εκτελεστεί έλεγχος από αυτή τη σύνδεση ή συμπληρώθηκε το ημερήσιο δοκιμαστικό όριο. Προσπαθήστε ξανά αργότερα." }, { status: 429 });
    const host = parsed.hostname.replace(/^www\./i, "");
    const queries = queryTemplates.map((template) => template.replaceAll("{service}", service).replaceAll("{area}", area));
    const providerReports = await Promise.all(providers.map(async (provider) => {
      const settled = await Promise.allSettled(queries.map((query) => providerQuery(provider, query, name, host)));
      const results = settled.map((item, index) => item.status === "fulfilled" ? item.value : ({ query: queries[index], answer: "", searchQueries: [], citations: [], businessMentioned: false, error: item.reason instanceof Error ? item.reason.message : "Το ερώτημα δεν ολοκληρώθηκε." }));
      return { provider: provider.name, model: provider.model, results, completed: results.filter((result) => result.answer).length, mentions: results.filter((result) => result.businessMentioned).length };
    }));
    if (!providerReports.some((provider) => provider.completed)) return NextResponse.json({ error: providerReports[0]?.results[0]?.error || "Δεν ήταν δυνατή η ολοκλήρωση του ελέγχου." }, { status: 502 });
    return NextResponse.json({ name, website: parsed.origin, area, service, checkedAt: new Date().toISOString(), providers: providerReports });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Δεν ήταν δυνατή η ολοκλήρωση του ελέγχου.";
    return NextResponse.json({ error: message }, { status: message.startsWith("Συμπληρώστε") || message.startsWith("Πληκτρολογήστε") ? 400 : 502 });
  }
}
