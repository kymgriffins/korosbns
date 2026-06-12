import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/services/email-sender";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    const recipient = to || "gr8builds@gmail.com";

    await sendEmail({
      to: recipient,
      subject: "Welcome to Budget Ndio Story — Verify Your Email",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f4f4; padding: 32px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 22px;">Budget Ndio Story</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Verify your email address</p>
    </div>
    <div style="padding: 32px;">
      <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
        Hi there,
      </p>
      <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
        Thank you for joining Budget Ndio Story — Kenya's civic platform for understanding
        national and county budgets.
      </p>
      <p style="margin: 0 0 24px; color: #333; font-size: 15px; line-height: 1.6;">
        Please verify your email by clicking the button below:
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="https://budgetndiostory.org/auth/verify?token=test-simulation-token"
           style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none;
                  padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Verify Email
        </a>
      </div>
      <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.5;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
    <div style="background: #f8f9fa; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #999; font-size: 11px;">
        Budget Ndio Story &middot; Nairobi, Kenya
      </p>
    </div>
  </div>
</body>
</html>`,
      text: `Welcome to Budget Ndio Story\n\nThank you for joining. Please verify your email by visiting:\nhttps://budgetndiostory.org/auth/verify?token=test-simulation-token\n\nIf you didn't create an account, ignore this email.`,
    });

    return NextResponse.json({
      status: "sent",
      to: recipient,
      message: "Test email sent successfully",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
