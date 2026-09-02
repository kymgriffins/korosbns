"use client";

import { useState } from "react";
import { StudioTheatreHub } from "@/components/studio/theatre/studio-theatre-hub";
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
      <StudioTheatreHub onCommissionClick={openBooking} />
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      <StudioContactCTA onCommissionClick={openBooking} />
    </>
  );
}
