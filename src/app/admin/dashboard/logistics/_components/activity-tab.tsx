"use client";

import { Circle } from "lucide-react";

import { getActivityForShipment } from "./shipment-data";

type ActivityTabProps = {
  shipmentId: string;
};

export function ActivityTab({ shipmentId }: ActivityTabProps) {
  const activity = getActivityForShipment(shipmentId);

  if (activity.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
        No activity data available for this shipment.
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      <div className="absolute bottom-0 left-[11px] top-0 w-0.5 bg-muted-foreground/20" />

      <div className="flex flex-col gap-6">
        {activity.map((event) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-[25px] top-0.5 flex size-[22px] items-center justify-center rounded-full border-2 border-background bg-primary/10">
              <Circle className="size-2.5 fill-primary text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{event.event}</span>
                <span className="text-muted-foreground text-xs">{event.timestamp}</span>
              </div>
              <p className="text-muted-foreground text-xs">{event.location} · {event.actor}</p>
              <p className="mt-1 text-xs leading-relaxed">{event.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
