"use client";

import React from "react";
import { Button } from "@/ui/button";
import {
  Bell, X
} from "lucide-react";
import { cn } from "@/utils";

interface ParticipationAlertsDrawerProps {
  profile: any;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: any) => void;
}

export function ParticipationAlertsDrawer({ profile, onClose, onUpdateProfile }: ParticipationAlertsDrawerProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background flex flex-col shadow-2xl md:max-w-xl md:mx-auto md:border-x border-border",
      "md:relative md:inset-auto md:z-auto md:border-0 md:shadow-none md:max-w-none md:h-full"
    )}>
      <header className="sticky top-0 z-10 w-full h-14 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase leading-none">Participation Trigger</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{profile.county} County Action</p>
          </div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onClose} className="rounded-full">
          <X className="size-5" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Bell className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-bold mb-1">No Active Alerts</h3>
          <p className="text-xs text-muted-foreground">
            We&apos;ll notify you here when there are active public participation windows in {profile.county} County.
          </p>
        </div>
      </div>
    </div>
  );
}
