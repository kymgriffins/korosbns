import { NextResponse } from "next/server";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";

export async function GET() {
  const data = headlessCmsApi.getCollectionData("redirects");
  return NextResponse.json({
    collection: "redirects",
    masterEditor: MASTER_CMS_EMAIL,
    timestamp: new Date().toISOString(),
    data,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      data?: { redirects?: Array<{ from: string; to: string; status: number; reason: string }> };
      editorEmail?: string;
    };
    const editorEmail = body.editorEmail || MASTER_CMS_EMAIL;
    const isMaster = editorEmail.toLowerCase() === MASTER_CMS_EMAIL.toLowerCase();
    const isAdminDomain = editorEmail.toLowerCase().endsWith("@budgetndiostory.org");

    if (!isMaster && !isAdminDomain) {
      return NextResponse.json(
        { error: "Permission Denied: Only Master CMS Editor or admin accounts can modify redirects." },
        { status: 403 },
      );
    }

    if (!body.data) {
      return NextResponse.json(
        { error: "Missing JSON data body payload" },
        { status: 400 },
      );
    }

    const res = headlessCmsApi.updateCollectionData("redirects", body.data, editorEmail);

    return NextResponse.json({
      ...res,
      masterEditor: MASTER_CMS_EMAIL,
      message: "Redirects updated successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update redirects" },
      { status: 500 },
    );
  }
}
