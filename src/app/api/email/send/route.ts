import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/services/email-sender";

export async function POST(req: Request) {
  try {
    const { to, subject, html, text, from } = await req.json();
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and either html or text" },
        { status: 400 },
      );
    }
    await sendEmail({ to, subject, html, text, from });
    return NextResponse.json({ status: "sent" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
