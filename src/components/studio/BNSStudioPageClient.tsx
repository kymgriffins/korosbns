"use client";

import { useState } from "react";
import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioIndexView } from "@/components/studio/theatre/studio-index-view";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => {
    setBookingOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const scrollToBrowse = () => {
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <StudioReelHero onBrowse={scrollToBrowse} onCommission={openBooking} />
      <div id="browse">
        <StudioIndexView onCommissionClick={openBooking} />
      </div>
      <div
        id="booking"
        className="border-t border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-bg)] px-4 py-12 md:px-8"
      >
        <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      </div>
    </>
  );
}
