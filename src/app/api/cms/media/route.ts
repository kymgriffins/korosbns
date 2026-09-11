import { NextResponse } from "next/server";
import { listR2Objects, deleteFromR2 } from "@/lib/r2-storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";
    const items = await listR2Objects(prefix);
    return NextResponse.json({
      success: true,
      items,
      count: items.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[R2 List Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to list media from Cloudflare R2" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Query parameter 'key' is required" },
        { status: 400 },
      );
    }

    await deleteFromR2(key);
    return NextResponse.json({
      success: true,
      deletedKey: key,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[R2 Delete Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete file from Cloudflare R2" },
      { status: 500 },
    );
  }
}
