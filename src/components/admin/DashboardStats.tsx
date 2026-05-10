'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, BarChart3, Clock } from "lucide-react";

interface StatsProps {
  stats: {
    total_posts: number;
    scheduled_posts: number;
    published_posts: number;
    total_engagement: number;
  };
}

export function DashboardStats({ stats }: StatsProps) {
  const items = [
    { title: "Total Posts", value: stats.total_posts, icon: Send, color: "text-blue-600" },
    { title: "Scheduled", value: stats.scheduled_posts, icon: Clock, color: "text-yellow-600" },
    { title: "Published", value: stats.published_posts, icon: Users, color: "text-green-600" },
    { title: "Engagement", value: `${stats.total_engagement}%`, icon: BarChart3, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
