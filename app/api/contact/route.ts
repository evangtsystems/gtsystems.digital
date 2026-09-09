import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxLengths = {
  name: 120,
  company: 160,
  email: 180,
  phone: 60,
  topic: 80,
  message: 2000,
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const payload = {
    name: clean(formData.get("name"), maxLengths.name),
    company: clean(formData.get("company"), maxLengths.company),
    email: clean(formData.get("email"), maxLengths.email),
    phone: clean(formData.get("phone"), maxLengths.phone),
    topic: clean(formData.get("topic"), maxLengths.topic),
    message: clean(formData.get("message"), maxLengths.message),
    locale: clean(formData.get("locale"), 8),
    createdAt: new Date().toISOString(),
  };
  const contactPath = payload.locale === "en" ? "/en/contact" : "/contact";

  if (!payload.name || !payload.email || !payload.message || !isEmail(payload.email)) {
    return NextResponse.redirect(new URL(`${contactPath}?error=1`, req.url), 303);
  }

  console.log("[CONTACT]", payload);

  return NextResponse.redirect(new URL(`${contactPath}?sent=1`, req.url), 303);
}

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
