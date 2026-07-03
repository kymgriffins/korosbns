"use client";

import { AlertTriangle, Box, Layers, Ruler, Weight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCargoForShipment, type CargoItem } from "./shipment-data";

type CargoTabProps = {
  shipmentId: string;
};

function CargoPackageCard({ item }: { item: CargoItem }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <Box className="size-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-sm">{item.description}</CardTitle>
            <div className="text-muted-foreground text-xs">{item.id}</div>
          </div>
        </div>
        {item.hazmat && (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-3" />
            Hazmat
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Weight className="size-3" />
              Weight
            </span>
            <span className="font-medium">{item.weight}</span>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Ruler className="size-3" />
              Dimensions
            </span>
            <span className="font-medium">{item.dimensions}</span>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Layers className="size-3" />
              Quantity
            </span>
            <span className="font-medium">{item.quantity.toLocaleString()} {item.unit}</span>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Box className="size-3" />
              Container
            </span>
            <span className="font-medium">{item.containerRef}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CargoTab({ shipmentId }: CargoTabProps) {
  const cargo = getCargoForShipment(shipmentId);

  if (cargo.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
        Cargo data not available for this shipment.
      </div>
    );
  }

  const totalWeight = cargo.reduce((sum, item) => sum + parseInt(item.weight.replace(/[^0-9]/g, "")) || 0, 0);
  const totalItems = cargo.reduce((sum, item) => sum + item.quantity, 0);
  const hazmatCount = cargo.filter((i) => i.hazmat).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total items</span>
          <span className="ml-2 font-medium tabular-nums">{totalItems.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total weight</span>
          <span className="ml-2 font-medium">{totalWeight.toLocaleString()} kg</span>
        </div>
        <div>
          <span className="text-muted-foreground">Packages</span>
          <span className="ml-2 font-medium">{cargo.length}</span>
        </div>
        {hazmatCount > 0 && (
          <div>
            <span className="text-muted-foreground">Hazmat items</span>
            <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">{hazmatCount}</span>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cargo.map((item) => (
          <CargoPackageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
