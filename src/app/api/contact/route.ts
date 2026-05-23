import { NextResponse } from "next/server";

function apiBase(): string {
  const base =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";
  return base.replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${apiBase()}/api/v1/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { detail: "Failed to send message." },
      { status: 502 },
    );
  }
}
