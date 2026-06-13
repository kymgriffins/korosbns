"use client";

import { Skeleton } from "@/ui/skeleton";
import { Card, CardContent } from "@/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-2 max-w-6xl mx-auto p-3 md:p-4 pb-20">
      {/* Hero */}
      <Card className="shadow-xs">
        <CardContent className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-14 rounded-lg" />
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardContent className="flex items-center gap-2 p-2.5">
              <Skeleton className="size-7 rounded-md shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-2 w-10" />
                <Skeleton className="h-3 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-2">
        <div className="space-y-2">
          {/* Stories */}
          <Card className="shadow-xs">
            <CardContent className="p-3">
              <Skeleton className="h-2.5 w-14 mb-2" />
              <div className="flex gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <Skeleton className="size-13 rounded-full" />
                    <Skeleton className="h-2 w-10" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Module cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-xs">
                <Skeleton className="aspect-video w-full rounded-none" />
                <CardContent className="p-2 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-1/2" />
                  <Skeleton className="h-2 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leaderboard */}
          <Card className="shadow-xs">
            <CardContent className="p-3">
              <Skeleton className="h-2.5 w-20 mb-2" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="size-5 rounded-full" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                  <Skeleton className="h-2 w-10" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-2">
          <Card className="shadow-xs">
            <CardContent className="p-3">
              <Skeleton className="h-2.5 w-16 mb-3" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2 rounded-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
