import { NextResponse } from "next/server";

export async function POST() {
  console.log("[EmailHookNotify] POST /api/email-hooks/notify received");
  try {
    const { pollAndProcess } = await import("@/lib/services/email-hook-service");
    const count = await pollAndProcess();
    console.log(`[EmailHookNotify] pollAndProcess completed, processed ${count} hooks`);
    return NextResponse.json({ ok: true, processed: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[EmailHookNotify] error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
