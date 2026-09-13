import { NextResponse } from "next/server";
import { fetchR2Object, getMediaTypeFromKey } from "@/lib/r2-storage";

/**
 * Same-origin media preview for CMS R2 bucket browser.
 * Avoids blank thumbnails from encoding / referrer / mixed-path issues.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key || key.includes("..")) {
      return NextResponse.json({ error: "Valid key is required" }, { status: 400 });
    }

    const object = await fetchR2Object(key);
    if (!object) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    const { mimeType } = getMediaTypeFromKey(key);
    const contentType = object.contentType || mimeType;

    return new NextResponse(Buffer.from(object.body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Preview failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
