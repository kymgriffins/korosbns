import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const DEPLOY_WEBHOOK_ENDPOINT =
  process.env.DJANGO_DEPLOYMENT_WEBHOOK_URL ?? `${API_BASE}/deploy/webhook/`;
const WEBHOOK_TOKEN = process.env.DEPLOY_WEBHOOK_TOKEN;

async function invokeWebhook(action: "check" | "seed") {
  if (!WEBHOOK_TOKEN) {
    return NextResponse.json(
      { message: "Missing DEPLOY_WEBHOOK_TOKEN environment variable." },
      { status: 500 }
    );
  }

  const response = await fetch(DEPLOY_WEBHOOK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Deploy-Token": WEBHOOK_TOKEN,
    },
    body: JSON.stringify({ action }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}

export async function GET() {
  return invokeWebhook("check");
}

export async function POST() {
  return invokeWebhook("seed");
}
