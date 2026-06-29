"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/motion/variants";
import { WeeklyNoteComposer } from "@/components/notes/WeeklyNoteComposer";
import { WeeklyNotesList } from "@/components/notes/WeeklyNotesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { taskData } from "@/data/tasks";
import type { WeeklyNoteApi } from "@/types/notes";
import { Loader2, PenLine, FileText } from "lucide-react";
import { usePageView } from "@/hooks/use-page-view";

export default function ManageWeeklyNotesPage() {
  usePageView();
  const [notes, setNotes] = useState<WeeklyNoteApi[]>([]);
  const [editing, setEditing] = useState<WeeklyNoteApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  const fetchNotes = useCallback(async () => {
    try {
      const results = await taskData.tasks.fetch();
      setNotes(results as unknown as WeeklyNoteApi[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSaved = (note: WeeklyNoteApi) => {
    setEditing(note);
    setActiveTab("list");
    fetchNotes();
  };

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
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
            Manage Weekly Notes
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create, edit, and manage your weekly notes before publishing.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="list">
              <FileText className="size-4 mr-2" />
              My Notes ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="compose">
              <PenLine className="size-4 mr-2" />
              {editing ? "Edit Note" : "New Note"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <WeeklyNotesList notes={notes} />
          </TabsContent>

          <TabsContent value="compose">
            <div className="max-w-3xl mx-auto">
              <WeeklyNoteComposer
                existingNote={editing || undefined}
                onSaved={handleSaved}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
