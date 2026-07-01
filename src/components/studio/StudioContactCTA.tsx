"use client";

import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/contexts/org-context";

export function StudioContactCTA() {
  const { config } = useOrg();
  const whatsapp = config.contact?.whatsapp || "+254700000000";
  const phone = config.contact?.phone || "+254700000000";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md p-3 md:px-6 flex items-center justify-between gap-4">
      <div className="text-sm">
        <span className="hidden sm:inline text-muted-foreground">
          Ready to start your project?
        </span>
        <span className="font-semibold ml-1">Book a shoot today.</span>
      </div>
      <div className="flex items-center gap-3">
        <a href={`tel:${phone}`}>
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
            <Phone className="size-4" />
            <span className="hidden sm:inline">Call Us</span>
          </Button>
        </a>
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="gap-2 rounded-full">
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
