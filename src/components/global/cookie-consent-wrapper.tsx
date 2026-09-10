"use client";

import CookieConsent from "@/components/shadcn-space/blocks/cookie-consent-01";
import { SHOW_COOKIE_CONSENT } from "@/lib/marketing-chrome";

export default function CookieConsentWrapper() {
  if (!SHOW_COOKIE_CONSENT) return null;
  return <CookieConsent />;
}
