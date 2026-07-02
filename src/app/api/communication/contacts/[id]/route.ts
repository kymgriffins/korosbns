import { NextRequest, NextResponse } from "next/server";

const STORE: {
  contacts: Array<{ id: string; name: string; email: string; message: string; status: string; source?: string; reply?: string; created_at: string }>;
} = { contacts: [] };

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/communication\/contacts\/([^/]+)\//);
  if (!match) return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  const id = match[1];
  try {
    const body = await req.json();
    return NextResponse.json({ id, reply: body.reply, status: "REPLIED" });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/communication\/contacts\/([^/]+)\//);
  if (!match) return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  return NextResponse.json({ success: true });
}
