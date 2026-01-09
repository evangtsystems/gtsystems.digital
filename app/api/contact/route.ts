import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node.js runtime (not edge)

export async function POST(req: Request) {
  const formData = await req.formData();

  const payload = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    createdAt: new Date().toISOString(),
  };

  // TODO: store to DB or send email (nodemailer)
  console.log("[CONTACT]", payload);

  return NextResponse.json({ ok: true });
}
