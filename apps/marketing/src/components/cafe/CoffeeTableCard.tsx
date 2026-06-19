"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Coffee, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface CoffeeTableCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  topic?: string;
  messageCount: number;
  featured?: boolean;
}

export const CoffeeTableCard = ({
  title,
  slug,
  description,
  category,
  topic,
  messageCount,
  featured,
}: CoffeeTableCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/cafe/${slug}`}>
        <Card className={`h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 ${featured ? 'ring-2 ring-amber-500/20' : ''}`}>
          <CardHeader className="relative pb-2">
            {featured && (
              <Badge className="absolute right-4 top-4 bg-amber-500 hover:bg-amber-600">
                Hot Topic
              </Badge>
            )}
            <div className="flex items-center gap-2 text-amber-500">
              <Coffee className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{category || "General"}</span>
            </div>
            <CardTitle className="mt-2 line-clamp-1 text-xl">{title}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">
              {description || "Join the conversation about this budget topic."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topic && (
              <div className="mb-4 rounded-lg bg-amber-500/5 p-2 ring-1 ring-amber-500/10">
                <p className="text-[10px] font-medium text-amber-500 uppercase tracking-tighter">Current Discussion</p>
                <p className="line-clamp-1 text-xs font-semibold text-foreground/90">{topic}</p>
              </div>
            )}
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs">{messageCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">{Math.floor(messageCount / 3) + 1} active</span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-amber-500 group-hover:underline">Join Table →</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
