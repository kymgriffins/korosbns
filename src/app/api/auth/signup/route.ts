import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api-config";

const DEFAULT_SIGNUP_ENDPOINT = `${API_BASE_URL}/api/auth/register/`;

export async function POST(request: Request) {
  const endpoint = process.env.DJANGO_AUTH_REGISTER_URL ?? DEFAULT_SIGNUP_ENDPOINT;

  try {
    const body = await request.json();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const rawText = await response.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
    } catch {
      payload = {};
    }
    if (!response.ok) {
      const resolvedMessage =
        (payload?.detail as string | undefined) ??
        (payload?.message as string | undefined) ??
        (rawText?.trim() ? rawText : "Signup failed.");

      return NextResponse.json(
        {
          message: resolvedMessage,
          status: response.status,
          endpoint,
          payload,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, data: payload }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Could not complete signup.",
        detail,
        endpoint,
      },
      { status: 500 }
    );
  }
}
