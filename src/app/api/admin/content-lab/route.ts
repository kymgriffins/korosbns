import { NextResponse } from "next/server";

import { runContentLabSuite } from "@/lib/content-lab";

/** Thin suite endpoint for Admin Content Lab v1. */
export async function GET() {
  try {
    const snapshot = await runContentLabSuite();
    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Content lab suite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
