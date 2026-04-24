import { NextResponse } from "next/server";
import { getCampaignBySlug } from "@/lib/campaign/store";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: campaign });
}
