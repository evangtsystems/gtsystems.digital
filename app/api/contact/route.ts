import { NextResponse } from "next/server";

export const runtime = "nodejs";
const contactRecipient = "evangelos.lampos@gtsystems.gr";
const brevoEndpoint = "https://api.brevo.com/v3/smtp/email";

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
    return NextResponse.redirect(redirectUrl(req, `${contactPath}?emailError=1`), 303);
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
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "info@gtsystems.gr";
  const senderName = process.env.BREVO_SENDER_NAME ?? "GTSystems";

  if (!apiKey) {
    throw new Error("Missing Brevo configuration. Set BREVO_API_KEY.");
  }

  const response = await fetch(brevoEndpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: contactRecipient,
          name: "Evangelos Lampos",
        },
      ],
      replyTo: {
        email: payload.email,
        name: payload.name,
      },
      subject: `New GTSystems contact request from ${payload.name}`,
      textContent: contactEmailText(payload),
      htmlContent: contactEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Brevo email send failed with ${response.status}: ${responseBody}`);
  }
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
