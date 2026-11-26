import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import * as ipaddr from "ipaddr.js";
const MAX_BYTES = 2_000_000;
const agent = "GTSystemsReadinessBot";
type Result = { status: number; url: string; body: string; type: string; location?: string; headers: Record<string, string | string[] | undefined> };
function publicAddress(address: string) {
  try {
    let parsed = ipaddr.parse(address);
    if (parsed.kind() === "ipv6" && (parsed as ipaddr.IPv6).isIPv4MappedAddress()) parsed = (parsed as ipaddr.IPv6).toIPv4Address();
    return parsed.range() === "unicast";
  } catch { return false; }
}

export async function fetchPublic(input: string, redirects = 0): Promise<Result> {
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

