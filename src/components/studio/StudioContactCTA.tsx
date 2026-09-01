"use client";

import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/contexts/org-context";

type StudioContactCTAProps = {
  onCommissionClick?: () => void;
};

export function StudioContactCTA({ onCommissionClick }: StudioContactCTAProps) {
  const { config } = useOrg();
  const whatsapp = config.contact?.whatsapp || "+254700000000";
  const phone = config.contact?.phone || "+254700000000";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md md:px-6">
      <div className="text-sm">
        <span className="hidden text-muted-foreground sm:inline">
          Ready to commission impact content?
        </span>
        <span className="ml-1 font-semibold">Talk to our production team.</span>
      </div>
      <div className="flex items-center gap-3">
        {onCommissionClick ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-2 rounded-full"
            onClick={onCommissionClick}
          >
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">Inquiry form</span>
          </Button>
        ) : null}
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
