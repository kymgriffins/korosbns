"use client";

import { Globe, Link, Hash } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  visitors: {
    color: "var(--chart-1)",
    label: "Visitors",
  },
  pageviews: {
    color: "var(--chart-2)",
    label: "Pageviews",
  },
} satisfies ChartConfig;

type SourceRow = { source: string; count: number; percentage: number };
type ReferrerRow = { hostname: string; label: string; pageviews: number; percentage?: number };

function SourceBarChart({ data, valueKey }: { data: SourceRow[]; valueKey: "count" }) {
  const renderLabel = (props: LabelProps) => {
    const { height, value, y } = props;
    return (
      <text
        className="fill-foreground"
        dominantBaseline="middle"
        dx={-6}
        fontSize={13}
        textAnchor="end"
        x="100%"
        y={Number(y) + Number(height) / 2}
      >
        {value}
      </text>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 52 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis dataKey="source" hide tickLine={false} tickMargin={10} type="category" />
        <XAxis dataKey={valueKey} hide type="number" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar barSize={36} dataKey={valueKey} fill="var(--color-visitors)" fillOpacity={0.5} radius={6}>
          <LabelList className="fill-foreground" dataKey="source" fontSize={13} offset={12} position="insideLeft" />
          <LabelList content={renderLabel} dataKey="count" formatter={(v: unknown) => typeof v === "number" ? v.toLocaleString() : String(v)} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function ReferrerBarChart({ data }: { data: ReferrerRow[] }) {
  const renderLabel = (props: LabelProps) => {
    const { height, value, y } = props;
    return (
      <text
        className="fill-foreground"
        dominantBaseline="middle"
        dx={-6}
        fontSize={13}
        textAnchor="end"
        x="100%"
        y={Number(y) + Number(height) / 2}
      >
        {value}
      </text>
    );
  };

  const chartData = data.map((r) => ({
    source: r.label || r.hostname,
    pageviews: r.pageviews,
    percentage: r.percentage ?? 0,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ left: 0, right: 52 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis dataKey="source" hide tickLine={false} tickMargin={10} type="category" />
        <XAxis dataKey="pageviews" hide type="number" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar barSize={36} dataKey="pageviews" fill="var(--color-visitors)" fillOpacity={0.5} radius={6}>
          <LabelList className="fill-foreground" dataKey="source" fontSize={13} offset={12} position="insideLeft" />
          <LabelList content={renderLabel} dataKey="pageviews" formatter={(v: unknown) => typeof v === "number" ? v.toLocaleString() : String(v)} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function TopTrafficSources({
  sources,
  referrers,
}: {
  sources: SourceRow[];
  referrers: ReferrerRow[];
}) {
  const hasSources = sources.length > 0;
  const hasReferrers = referrers.length > 0;

  if (!hasSources && !hasReferrers) {
    return (
      <Card className="h-full gap-2">
        <CardHeader>
          <CardTitle className="font-normal">Traffic sources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No traffic source data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Traffic sources</CardTitle>
        <CardDescription>
          {hasSources ? `${sources.length} channels tracked` : ""}
          {hasSources && hasReferrers ? " · " : ""}
          {hasReferrers ? `${referrers.length} referrers` : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="sources" className="flex flex-col gap-3">
          <TabsList className="w-full justify-start border-b px-2.5" variant="line">
            {hasSources ? (
              <TabsTrigger className="flex-none font-normal" value="sources">
                <Hash className="mr-1.5 size-3.5" />
                Sources
              </TabsTrigger>
            ) : null}
            {hasReferrers ? (
              <TabsTrigger className="flex-none font-normal" value="referrers">
                <Link className="mr-1.5 size-3.5" />
                Referrers
              </TabsTrigger>
            ) : null}
          </TabsList>

          {hasSources ? (
            <TabsContent value="sources" className="px-4">
              <SourceBarChart data={sources} valueKey="count" />
            </TabsContent>
          ) : null}
          {hasReferrers ? (
            <TabsContent value="referrers" className="px-4">
              <ReferrerBarChart data={referrers} />
            </TabsContent>
          ) : null}
        </Tabs>
      </CardContent>
    </Card>
  );
}
