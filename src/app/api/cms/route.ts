import { NextResponse } from "next/server";
import { headlessCmsApi, MASTER_CMS_EMAIL } from "@/lib/headless-cms";

export async function GET() {
  return NextResponse.json({
    collections: headlessCmsApi.getAllCollections(),
    coreSlugs: headlessCmsApi.getCollections().map((c) => c.slug),
    masterEditor: MASTER_CMS_EMAIL,
    timestamp: new Date().toISOString(),
  });
}
