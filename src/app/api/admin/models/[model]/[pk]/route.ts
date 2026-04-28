import { NextResponse } from "next/server";
import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const detailEndpoint = (model: string, pk: string) => `${API_BASE}/api/admin/models/${model}/${pk}/`;

async function withRetry(url: string, method: string, body?: unknown) {
  const { headers } = await getAuthHeaders();
  let response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  let refreshed: string | undefined | null;
  if (response.status === 401) {
    refreshed = await refreshAccessIfNeeded(response.status);
    if (refreshed) {
      response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshed}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
    }
  }
  const payload = await response.json().catch(() => ({}));
  const out = NextResponse.json(payload, { status: response.status });
  if (refreshed) {
    out.cookies.set("bns_admin_session", refreshed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  }
  return out;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ model: string; pk: string }> }
) {
  const { model, pk } = await params;
  const body = await request.json();
  return withRetry(detailEndpoint(model, pk), "PATCH", body);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ model: string; pk: string }> }
) {
  const { model, pk } = await params;
  return withRetry(detailEndpoint(model, pk), "DELETE");
}
