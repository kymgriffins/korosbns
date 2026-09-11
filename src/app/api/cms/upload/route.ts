import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const customFolder = (formData.get("folder") as string) || "uploads";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${customFolder}/${Date.now()}-${cleanName}`;

    const { url } = await uploadToR2(
      key,
      buffer,
      file.type || "application/octet-stream",
    );

    return NextResponse.json({
      success: true,
      url,
      key,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  } catch (err: any) {
    console.error("[R2 Upload Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file to Cloudflare R2" },
      { status: 500 },
    );
  }
}
