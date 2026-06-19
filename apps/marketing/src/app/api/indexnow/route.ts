import { NextResponse } from "next/server";
import { pingIndexNow } from "@/lib/indexnow";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "Please provide an array of URLs to index." },
        { status: 400 }
      );
    }

    const success = await pingIndexNow(urls);

    if (success) {
      return NextResponse.json({ message: "Successfully pinged IndexNow." });
    } else {
      return NextResponse.json(
        { error: "Failed to ping IndexNow. Check logs." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("IndexNow API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
