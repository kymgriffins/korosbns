"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import type { WeeklyNoteApi } from "@/types/notes";

type Props = {
  notes: WeeklyNoteApi[];
};

export function WeeklyNoteTimeline({ notes }: Props) {
  if (!notes.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Calendar className="size-12 mx-auto mb-4 opacity-40" />
        <p className="text-lg font-medium">No published notes yet</p>
        <p className="text-sm">Check back soon for weekly updates</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border/60 md:left-1/2 md:-translate-x-px" />

      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          variants={fadeInUp}
          className="relative pl-12 pb-12 md:pl-0 md:odd:pr-12 md:even:pl-12 md:w-1/2 md:odd:ml-0 md:even:ml-auto"
        >
          <div className="absolute left-2.5 top-1 size-3 rounded-full bg-primary border-2 border-background md:left-auto md:odd:right-[-6.5px] md:even:left-[-6.5px]" />

          <div className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="size-3.5" />
              {format(new Date(note.created_at), "MMM d, yyyy")}
              <span className="text-primary font-medium">— {note.week_label}</span>
            </div>
            <h3 className="font-semibold mb-2">{note.title}</h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none line-clamp-3 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: note.content ?? "" }}
            />
            <div className="mt-3 text-xs text-muted-foreground">
              By {note.author_name}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
