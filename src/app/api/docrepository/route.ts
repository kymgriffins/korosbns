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

/** GET /api/docrepository  – list files */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const path = sp.get("path") || "";
  const url = backendUrl(`files/${path ? `?path=${encodeURIComponent(path)}` : ""}`);

  try {
    const res = await fetch(url, { headers: authHeaders(req), cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Document repository unavailable", items: [], count: 0 },
      { status: 503 },
    );
  }
}

/** POST /api/docrepository  – upload file, create folder, or delete */
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

/** DELETE /api/docrepository  – delete file or folder */
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
