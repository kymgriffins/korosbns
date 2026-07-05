"use client";

import dynamic from "next/dynamic";

const CookieConsent = dynamic(
  () => import("@/components/shadcn-space/blocks/cookie-consent-01"),
  { ssr: false }
);

export default function CookieConsentWrapper() {
  return (
    <div className="fixed inset-0 z-[999]">
      <CookieConsent />
    </div>
  );
}
