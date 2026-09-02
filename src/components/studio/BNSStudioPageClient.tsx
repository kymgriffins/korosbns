"use client";

import { useState } from "react";
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

  return (
    <>
      <StudioIndexView onCommissionClick={openBooking} />
      <div id="booking" className="border-t border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-bg)] px-4 py-12 md:px-8">
        <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      </div>
    </>
  );
}
