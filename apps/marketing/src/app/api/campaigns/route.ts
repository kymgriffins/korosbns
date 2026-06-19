import { NextResponse } from "next/server";
import { createCampaignSchema } from "@/lib/campaign/schema";
import { createCampaign, listCampaigns } from "@/lib/campaign/store";
import { CampaignStatus } from "@/lib/campaign/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  const status =
    statusParam === "active" || statusParam === "upcoming" || statusParam === "completed"
      ? (statusParam as CampaignStatus)
      : undefined;

  return NextResponse.json({
    success: true,
    data: listCampaigns(status),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const campaign = createCampaign(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Campaign created",
        data: campaign,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create campaign" }, { status: 500 });
  }
}
