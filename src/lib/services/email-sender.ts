import nodemailer from "nodemailer";

export type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

function getConfig() {
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

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const config = getConfig();
  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error("SMTP not configured");
  }
  const transporter = nodemailer.createTransport(config);
  await transporter.sendMail({
    from: payload.from || getFromAddress(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html || undefined,
    text: payload.text || undefined,
  });
}
