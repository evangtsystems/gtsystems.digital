import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
const contactRecipient = "evangelos.lampos@gtsystems.gr";

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
    return NextResponse.redirect(redirectUrl(req, `${contactPath}?error=1`), 303);
  }

  try {
    await sendContactEmail(payload);
  } catch (error) {
    console.error("[CONTACT_EMAIL_ERROR]", error);
    return NextResponse.redirect(redirectUrl(req, `${contactPath}?error=1`), 303);
  }

  return NextResponse.redirect(redirectUrl(req, `${contactPath}?sent=1`), 303);
}

type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  locale: string;
  createdAt: string;
};

async function sendContactEmail(payload: ContactPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) {
    throw new Error("Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from,
    to: contactRecipient,
    replyTo: payload.email,
    subject: `New GTSystems contact request from ${payload.name}`,
    text: contactEmailText(payload),
    html: contactEmailHtml(payload),
  });
}

function contactEmailText(payload: ContactPayload) {
  return [
    "New GTSystems contact request",
    "",
    `Name: ${payload.name}`,
    `Company: ${payload.company || "-"}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Topic: ${payload.topic || "-"}`,
    `Language: ${payload.locale || "el"}`,
    `Created at: ${payload.createdAt}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function contactEmailHtml(payload: ContactPayload) {
  return `
    <div style="font-family:Arial,sans-serif;color:#10140f;line-height:1.6">
      <h2>New GTSystems contact request</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${emailRow("Name", payload.name)}
        ${emailRow("Company", payload.company || "-")}
        ${emailRow("Email", payload.email)}
        ${emailRow("Phone", payload.phone || "-")}
        ${emailRow("Topic", payload.topic || "-")}
        ${emailRow("Language", payload.locale || "el")}
        ${emailRow("Created at", payload.createdAt)}
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>
  `;
}

function emailRow(label: string, value: string) {
  return `
    <tr>
      <th align="left" style="border-bottom:1px solid #dfe6d6">${escapeHtml(label)}</th>
      <td style="border-bottom:1px solid #dfe6d6">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function redirectUrl(req: Request, path: string) {
  const currentUrl = new URL(req.url);
  const host = firstHeaderValue(req.headers.get("x-forwarded-host")) ?? req.headers.get("host") ?? currentUrl.host;
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = isLocal ? "http:" : "https:";

  return new URL(path, `${protocol}//${host}`);
}

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}
