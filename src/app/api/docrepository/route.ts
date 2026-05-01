import { NextResponse } from "next/server";

const DEFAULT_UPSTREAM =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.budgetndiostory.org";

function normalizeBase(url: string) {
  return url.replace(/\/+$/, "");
}

/** Try several upstream paths (Passenger / reverse proxies sometimes strip prefixes). */
const UPSTREAM_PATHS = [
  "/docrepository/",
  "/api/docrepository/",
  "/repository/",
  "/api/repository/",
];

export async function GET() {
  const base = normalizeBase(
    process.env.DOC_REPOSITORY_UPSTREAM_URL || DEFAULT_UPSTREAM,
  );

  for (const path of UPSTREAM_PATHS) {
    try {
      const url = `${base}${path}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });
      if (!res.ok) continue;
      const data = (await res.json()) as unknown;
      if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as { folders?: unknown }).folders) &&
        Array.isArray((data as { documents?: unknown }).documents)
      ) {
        return NextResponse.json(data);
      }
    } catch {
      // try next path
    }
  }

  return NextResponse.json(
    {
      status: "error",
      message: "Document repository unavailable",
      folders: [],
      documents: [],
    },
    { status: 503 },
  );
}
