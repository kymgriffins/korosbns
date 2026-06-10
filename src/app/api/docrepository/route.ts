import { NextRequest, NextResponse } from "next/server";

const UPSTREAM =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://bnske.budgetndiostory.org";

function backendUrl(path: string) {
  return `${UPSTREAM.replace(/\/+$/, "")}/api/v1/docrepository/${path.replace(/^\/+/, "")}`;
}

function authHeaders(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (auth) headers["Authorization"] = auth;
  return headers;
}

/** GET /api/docrepository?path=...  – list files (public) */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const queryPath = sp.get("path") || "";

  // Also support path from URL pathname (e.g. /api/docrepository/link/<uuid>)
  const pathname = req.nextUrl.pathname;
  const repoPrefix = "/api/docrepository/";
  const pathFromUrl = pathname.startsWith(repoPrefix)
    ? decodeURIComponent(pathname.slice(repoPrefix.length).replace(/\/$/, ""))
    : "";
  const path = queryPath || pathFromUrl;

  // Link proxy: /api/docrepository/link/<uuid>?mode=view|download
  const linkMatch = path.match(/^link\/([0-9a-f-]{36})$/i);
  if (linkMatch) {
    const linkId = linkMatch[1];
    const mode = sp.get("mode") || "view";
    try {
      const res = await fetch(
        backendUrl(`links/${linkId}/proxy/?mode=${encodeURIComponent(mode)}`),
        { headers: authHeaders(req) },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return NextResponse.json(body, { status: res.status });
      }
      const contentType = res.headers.get("content-type") || "application/pdf";
      const contentDisposition = res.headers.get("content-disposition") || `inline; filename="document.pdf"`;
      const body = await res.arrayBuffer();
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return NextResponse.json({ detail: "Upstream unavailable" }, { status: 502 });
    }
  }

  // If a specific file path is requested (has extension), proxy as file download
  if (path && /\.\w+$/.test(path.split("/").pop() || "")) {
    try {
      // Encode each path segment individually so slashes are preserved as path separators
      const encodedSegments = path.split("/").map(encodeURIComponent).join("/");
      // Pass download param through to Django backend
      const downloadParam = sp.get("download");
      const qs = downloadParam ? `?download=${encodeURIComponent(downloadParam)}` : "";
      const res = await fetch(backendUrl(`files/${encodedSegments}${qs}`), {
        headers: authHeaders(req),
      });
      if (!res.ok) {
        return NextResponse.json({ detail: "Not found" }, { status: res.status });
      }
      const contentType = res.headers.get("content-type") || "application/octet-stream";
      const contentDisposition = res.headers.get("content-disposition") || `inline; filename="${path.split("/").pop()}"`;
      const contentLength = res.headers.get("content-length");
      const body = await res.arrayBuffer();
      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "public, max-age=3600",
      };
      if (contentLength) headers["Content-Length"] = contentLength;
      return new NextResponse(body, { status: 200, headers });
    } catch {
      return NextResponse.json({ detail: "Upstream unavailable" }, { status: 502 });
    }
  }

  // Directory listing
  const qs = path ? `?path=${encodeURIComponent(path)}` : "";
  try {
    const res = await fetch(backendUrl(`files/${qs}`), {
      headers: authHeaders(req),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Document repository unavailable", items: [], count: 0 },
      { status: 503 },
    );
  }
}

/** POST /api/docrepository  – upload file or create folder (auth required) */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = formData.get("action") as string;

    if (action === "create_folder") {
      const name = formData.get("name") as string;
      const path = (formData.get("path") as string) || "";
      const res = await fetch(backendUrl("folders/"), {
        method: "POST",
        headers: { ...authHeaders(req), "Content-Type": "application/json" },
        body: JSON.stringify({ name, path }),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    if (action === "upload") {
      const file = formData.get("file") as File;
      const path = (formData.get("path") as string) || "";
      const upstreamForm = new FormData();
      upstreamForm.append("file", file);
      const qs = path ? `?path=${encodeURIComponent(path)}` : "";
      const res = await fetch(backendUrl(`files/upload/${qs}`), {
        method: "POST",
        headers: authHeaders(req),
        body: upstreamForm,
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ detail: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ detail: "Request failed" }, { status: 500 });
  }
}

/** DELETE /api/docrepository  – delete file or folder (auth required) */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const filePath = body.path as string;

    if (!filePath) {
      return NextResponse.json({ detail: "path is required" }, { status: 400 });
    }

    const res = await fetch(backendUrl(`files/${encodeURIComponent(filePath)}`), {
      method: "DELETE",
      headers: authHeaders(req),
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: "Request failed" }, { status: 500 });
  }
}
