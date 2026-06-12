import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };
}

function getFromAddress(): string {
  return process.env.SMTP_FROM || "Budget Ndio Story <noreply@budgetndiostory.org>";
}

export async function POST(req: Request) {
  try {
    const { to, subject, html, text, from } = await req.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and either html or text" },
        { status: 400 },
      );
    }

    const config = getSmtpConfig();
    if (!config.host || !config.auth.user || !config.auth.pass) {
      return NextResponse.json(
        { error: "SMTP not configured" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport(config);
    await transporter.sendMail({
      from: from || getFromAddress(),
      to,
      subject,
      html: html || undefined,
      text: text || undefined,
    });

    return NextResponse.json({ status: "sent" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
