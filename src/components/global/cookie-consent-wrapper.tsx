"use client";

import dynamic from "next/dynamic";

const CookieConsent = dynamic(
  () => import("@/components/shadcn-space/blocks/cookie-consent-01"),
  { ssr: false }
);

export default function CookieConsentWrapper() {
  return <CookieConsent />;
}
