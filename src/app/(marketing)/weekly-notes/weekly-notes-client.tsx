"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { WeeklyNoteTimeline } from "@/components/notes/WeeklyNoteTimeline";
import { citizenApi, type ApiListResponse, type WeeklyNoteApi } from "@/lib/api-client";
import { Calendar, Loader2 } from "lucide-react";

export function WeeklyNotesClient() {
  const [notes, setNotes] = useState<WeeklyNoteApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citizenApi
      .getWeeklyNotes()
      .then((res: ApiListResponse<WeeklyNoteApi>) => {
        setNotes(res.results || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <Calendar className="size-8 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
              Weekly Notes
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Regular updates on Kenya&apos;s budget process, fiscal policy, and
              parliamentary developments — curated by the Budget Ndio Story team.
            </p>
          </motion.div>
        </motion.div>

        <WeeklyNoteTimeline notes={notes} />
      </div>
    </section>
  );
}
