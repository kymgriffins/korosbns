import { NextRequest, NextResponse } from "next/server";

const UPSTREAM =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://bnske.budgetndiostory.org";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filePath = sp.get("path");
  const fileName = sp.get("name") || "download";

  if (!filePath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const upstream = `${UPSTREAM.replace(/\/+$/, "")}/${filePath.replace(/^\//, "")}`;

  try {
    const auth = req.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (auth) headers["Authorization"] = auth;

    const res = await fetch(upstream, { headers });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status },
      );
    }

    const body = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": body.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }
}
