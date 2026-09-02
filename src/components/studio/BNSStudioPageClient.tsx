"use client";

import { useState } from "react";
import { StudioHero } from "@/components/studio/StudioHero";
import { MissionWorkHub } from "@/components/work-hub/mission-work-hub";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => {
    setBookingOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      <StudioHero />
      <MissionWorkHub />
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      <StudioContactCTA onCommissionClick={openBooking} />
    </>
  );
}
