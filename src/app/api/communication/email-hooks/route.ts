import { NextResponse } from "next/server";

const hooks = [
  { id: "1", recipient: "jane@example.com", subject: "Welcome to Budget Ndio Story", status: "sent", source: "newsletter_welcome", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", recipient: "peter@example.com", subject: "Your task has been assigned", status: "sent", source: "task_assigned", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", recipient: "admin@budgetndiostory.org", subject: "New contact form submission", status: "pending", source: "contact_alert", created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: "4", recipient: "grace@example.com", subject: "Budget report notification", status: "failed", source: "campaign", error_message: "SMTP connection timeout", created_at: new Date(Date.now() - 86400000).toISOString() },
];

export async function GET() {
  return NextResponse.json(hooks);
}
