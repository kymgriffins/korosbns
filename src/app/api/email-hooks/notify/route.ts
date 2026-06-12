import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { pollAndProcess } = await import("@/lib/services/email-hook-service");
    await pollAndProcess();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
