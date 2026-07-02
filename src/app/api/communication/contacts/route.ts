import { NextRequest, NextResponse } from "next/server";

const STORE: {
  contacts: Array<{ id: string; name: string; email: string; message: string; status: string; source?: string; reply?: string; created_at: string }>;
} = {
  contacts: [
    {
      id: "1", name: "Jane Mwangi", email: "jane@example.com",
      message: "I would like to know more about the county budget allocation for education.",
      status: "NEW", source: "website", created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2", name: "Peter Kamau", email: "peter@example.com",
      message: "When is the next town hall meeting scheduled?",
      status: "READ", source: "chatbot", created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "3", name: "Grace Otieno", email: "grace@example.com",
      message: "I need help accessing the budget reports for Nakuru county.",
      status: "REPLIED", source: "website", reply: "Thank you for reaching out. The Nakuru county reports are available on our platform.",
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
};

export async function GET() {
  return NextResponse.json(STORE.contacts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contact = {
    id: String(Date.now()),
    name: body.name || "Anonymous",
    email: body.email || "",
    message: body.message || "",
    status: "NEW",
    source: body.source || "api",
    created_at: new Date().toISOString(),
  };
  STORE.contacts.unshift(contact);
  return NextResponse.json(contact, { status: 201 });
}
