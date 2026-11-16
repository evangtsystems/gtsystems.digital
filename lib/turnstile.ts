const testSiteKey = "1x00000000000000000000AA";
const testSecretKey = "1x0000000000000000000000000000000AA";

export function turnstileSiteKey() {
  const key = process.env.TURNSTILE_SITE_KEY || (process.env.NODE_ENV === "development" ? testSiteKey : "");
  // Cloudflare's public test credentials must never protect a real deployment.
  return process.env.NODE_ENV === "production" && /^[123]x0{10,}/.test(key) ? "" : key;
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV === "development" ? testSecretKey : "");
  if (!token || token.length > 2048 || !secret || !turnstileSiteKey()) return false;
  if (process.env.NODE_ENV === "production" && /^[123]x0{10,}/.test(secret)) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return false;
    const result: { success?: boolean } = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[CONTACT_VERIFICATION_ERROR]", error);
    return false;
  }
}
