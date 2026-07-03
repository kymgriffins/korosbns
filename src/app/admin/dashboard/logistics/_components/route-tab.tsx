"use client";

import { Plane, Ship, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRouteForShipment, type RouteStop } from "./shipment-data";

const modeIcons = { air: Plane, land: Truck, sea: Ship } as const;

function formatDuration(minutes: number): string {
  if (minutes >= 1440) return `${Math.round(minutes / 1440)}d ${Math.round((minutes % 1440) / 60)}h`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${minutes}m`;
}

function StopCard({ stop, index, total }: { stop: RouteStop; index: number; total: number }) {
  const ArrivalIcon = stop.arrivalMode ? modeIcons[stop.arrivalMode] : null;

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium ${
          stop.status === "completed" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
          stop.status === "active" ? "border-primary bg-primary/10 text-primary" :
          stop.status === "delayed" ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400" :
          "border-muted-foreground/30 bg-muted text-muted-foreground"
        }`}>
          {index + 1}
        </div>
        {index < total - 1 && (
          <div className={`h-full w-0.5 ${
            stop.status === "completed" ? "bg-emerald-500/30" :
            stop.status === "active" ? "bg-primary/30" : "bg-muted-foreground/20"
          }`} />
        )}
      </div>

      <div className={`min-w-0 flex-1 pb-8 ${index === total - 1 ? "pb-0" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{stop.location}</span>
              <Badge variant="outline" className={`text-[10px] ${
                stop.status === "completed" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" :
                stop.status === "active" ? "border-primary/30 bg-primary/5 text-primary" :
                stop.status === "delayed" ? "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400" :
                "text-muted-foreground"
              }`}>
                {stop.status === "completed" ? "Departed" : stop.status === "active" ? "Arrived" : stop.status === "delayed" ? "Delayed" : "Scheduled"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{stop.country}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs tabular-nums">
              {stop.arrivalTime}
            </div>
            {stop.departureTime && (
              <div className="text-muted-foreground text-[10px]">
                Dep: {stop.departureTime}
              </div>
            )}
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-3 text-muted-foreground text-[11px]">
          {ArrivalIcon && <ArrivalIcon className="size-3" />}
          <span>{stop.transportDetail}</span>
          {stop.distanceFromPrev && (
            <>
              <span>·</span>
              <span>{stop.distanceFromPrev}</span>
            </>
          )}
          {stop.durationFromPrev && (
            <>
              <span>·</span>
              <span>{formatDuration(stop.durationFromPrev)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

type RouteTabProps = {
  shipmentId: string;
};

export function RouteTab({ shipmentId }: RouteTabProps) {
  const route = getRouteForShipment(shipmentId);
  if (!route) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
        Route data not available for this shipment.
      </div>
    );
  }

  const totalDistance = route.stops.reduce((sum, s) => {
    const num = parseInt(s.distanceFromPrev ?? "0");
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalDuration = route.stops.reduce((sum, s) => sum + s.durationFromPrev, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total distance</span>
          <span className="ml-2 font-medium">{totalDistance.toLocaleString()} km</span>
        </div>
        <div>
          <span className="text-muted-foreground">Est. duration</span>
          <span className="ml-2 font-medium">{formatDuration(totalDuration)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Stops</span>
          <span className="ml-2 font-medium">{route.stops.length}</span>
        </div>
      </div>

      <Separator />

      <div className="pl-1">
        {route.stops.map((stop, index) => (
          <StopCard key={index} stop={stop} index={index} total={route.stops.length} />
        ))}
      </div>
    </div>
  );
}
