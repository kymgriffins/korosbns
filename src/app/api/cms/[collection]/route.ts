import { NextResponse } from "next/server";
import { headlessCmsApi, MASTER_CMS_EMAIL, type CmsCollectionSlug } from "@/lib/headless-cms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  const slug = collection as CmsCollectionSlug;

  try {
    const data = headlessCmsApi.getCollectionData(slug);
    return NextResponse.json({
      collection: slug,
      masterEditor: MASTER_CMS_EMAIL,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Collection not found" },
      { status: 404 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  const slug = collection as CmsCollectionSlug;

  try {
    const body = (await request.json()) as { data?: Record<string, unknown>; editorEmail?: string };
    const editorEmail = body.editorEmail || MASTER_CMS_EMAIL;

    if (!body.data) {
      return NextResponse.json({ error: "Missing JSON data body payload" }, { status: 400 });
    }

    const res = headlessCmsApi.updateCollectionData(slug, body.data, editorEmail);
    return NextResponse.json({
      ...res,
      masterEditor: MASTER_CMS_EMAIL,
      message: `Successfully updated ${slug} collection in Headless CMS.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update collection" },
      { status: 403 },
    );
  }
}
