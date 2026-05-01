import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api-config";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug || slug.length > 128) {
    return NextResponse.json({ detail: "Invalid slug." }, { status: 400 });
  }

  const url = `${API_BASE_URL}/api/public/organizations/${encodeURIComponent(slug)}/site/`;
  try {
    const upstream = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Upstream error" },
      { status: 502 },
    );
  }
}
