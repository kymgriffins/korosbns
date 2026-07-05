"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Search, MapPin, Users, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/motion/motion-tokens";
import type { BudgetSchema } from "@/lib/budget-schema";
import type { FiscalYearMeta } from "@/lib/reports-api";
import { seedCountyProfiles } from "@/lib/reports-api";
import type { CountyBudgetProfile } from "@/lib/budget-schema";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

const ALL_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
];

const TRANSPARENCY_COLORS: Record<string, string> = {
  High: "text-success bg-success/10 border-success/20",
  Moderate: "text-warning bg-warning/10 border-warning/20",
  Low: "text-destructive bg-destructive/10 border-destructive/20",
};

export function CountiesTab({ selectedYear }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const profiles = seedCountyProfiles();

  const filtered = ALL_COUNTIES.filter((c) =>
    !search || c.toLowerCase().includes(search.toLowerCase()),
  );

  if (selectedCounty) {
    const profile = profiles[selectedCounty.toLowerCase().replace(/['\s]/g, "")] ?? null;
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedCounty(null)} className="w-fit">
          &larr; Back to all counties
        </Button>
        <motion.div variants={fadeItem}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{selectedCounty}</CardTitle>
                  <p className="text-xs text-muted-foreground">{profile?.tagline ?? "County Government"}</p>
                </div>
                {profile && (
                  <Badge className={cn("border", TRANSPARENCY_COLORS[profile.transparency_rating])}>
                    {profile.transparency_rating} Transparency
                  </Badge>
                )}
              </div>
            </CardHeader>
            {profile && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Total Allocation</span>
                    <p className="text-lg font-bold tabular-nums">KES {profile.total_allocation.toLocaleString()}B</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Per Capita</span>
                    <p className="text-lg font-bold tabular-nums">KES {profile.allocation_per_capita.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Citizen Rating</span>
                    <p className="text-lg font-bold tabular-nums flex items-center gap-1">
                      {profile.citizen_rating}
                      <Star className="size-3.5 fill-warning text-warning" />
                    </p>
                  </div>
                </div>
                {profile.sector_breakdown.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3">Sector Allocation Breakdown</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profile.sector_breakdown} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                          <ReTooltip />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search counties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {ALL_COUNTIES.length} counties
        </p>
        <p className="text-xs text-muted-foreground">FY: {selectedYear}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((county, i) => {
          const profile = profiles[county.toLowerCase().replace(/['\s]/g, "")] ?? null;
          return (
            <motion.div key={county} variants={fadeItem}>
              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                onClick={() => setSelectedCounty(county)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="size-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold">{county}</span>
                    </div>
                    {profile && (
                      <Badge className={cn("border text-micro", TRANSPARENCY_COLORS[profile.transparency_rating])}>
                        {profile.transparency_rating}
                      </Badge>
                    )}
                  </div>
                  {profile && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="size-3" />
                        <span>KES {profile.total_allocation.toLocaleString()}B</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="size-3 fill-warning text-warning" />
                        <span>{profile.citizen_rating}/5</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
