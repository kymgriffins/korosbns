import { gamificationHeaders, getGamificationDeviceId } from "@/lib/gamification";
import { resolveAppUrl } from "@/lib/api-url";

const REFERRAL_CODE_STORAGE_KEY = "bns_referral_code";
const REFERRAL_CLAIMED_STORAGE_KEY = "bns_referral_claimed";

export type ReferralInfo = {
  code: string;
  share_url: string;
  referrals_count?: number;
};

export function storePendingReferralCode(code: string): void {
  if (typeof window === "undefined" || !code.trim()) return;
  window.localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, code.trim().toUpperCase());
}

export function getPendingReferralCode(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(REFERRAL_CODE_STORAGE_KEY) || "";
}

export function captureReferralFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return null;
  storePendingReferralCode(ref);
  return ref.toUpperCase();
}

export async function fetchReferralInfo(): Promise<ReferralInfo | null> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/referrals/me/"), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as ReferralInfo;
  } catch {
    return null;
  }
}

export async function claimReferral(referralCode?: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    const claimed = window.localStorage.getItem(REFERRAL_CLAIMED_STORAGE_KEY);
    if (claimed === "1") return false;
  }
  const code = (referralCode || getPendingReferralCode()).trim();
  if (!code) return false;
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/referrals/claim/"), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify({ referral_code: code }),
    });
    if (!res.ok) return false;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(REFERRAL_CLAIMED_STORAGE_KEY, "1");
      window.localStorage.removeItem(REFERRAL_CODE_STORAGE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

export function buildReferralShareUrl(code: string, path = "/learn"): string {
  if (typeof window === "undefined") return `${path}?ref=${code}`;
  const url = new URL(path, window.location.origin);
  url.searchParams.set("ref", code);
  return url.toString();
}

export function referralDeviceId(): string {
  return getGamificationDeviceId();
}
