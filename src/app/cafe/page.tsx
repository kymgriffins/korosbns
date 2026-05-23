"use client";

import React, { useEffect, useState } from "react";
import { Coffee, MessageCircle, Info } from "lucide-react";
import { CoffeeTableCard } from "@/components/cafe/CoffeeTableCard";
import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";

export default function CafeLandingPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cafe/rooms/")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-muted/20 py-16 lg:py-24">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_50%)]" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
              <Coffee className="h-8 w-8 text-amber-500" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl"
          >
            Budget <span className="text-amber-500">Cafe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            An avenue for users to meet, greet, and talk about the budget. 
            Pull up a chair at one of our coffee tables and join the conversation.
          </motion.p>
        </div>
      </section>

      {/* Tables Grid */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Pick a Coffee Table</h2>
            <p className="text-sm text-muted-foreground">Active discussions across different budget sectors.</p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Info className="h-4 w-4" />
            How it works
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <CoffeeTableCard
                key={room.id}
                title={room.title}
                slug={room.slug}
                description={room.description}
                category={room.category}
                topic={room.current_topic}
                messageCount={room.message_count}
                featured={room.featured}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-20 text-center">
            <CardContent>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">No active tables right now</h3>
              <p className="text-sm text-muted-foreground">The Cafe is currently empty. Check back later for hosted sessions!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Community Stats Footer */}
      <section className="border-t border-border/40 bg-muted/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">2.4k+</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Daily Visitors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">12</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Active Tables</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">47</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Counties Involved</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
