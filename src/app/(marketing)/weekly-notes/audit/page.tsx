"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/motion/variants";
import { WeeklyNotesList } from "@/components/notes/WeeklyNotesList";
import { WeeklyNoteAuditPanel } from "@/components/notes/WeeklyNoteAuditPanel";
import { citizenApi, type ApiListResponse, type WeeklyNoteApi } from "@/lib/api-client";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AuditWeeklyNotesPage() {
  const [notes, setNotes] = useState<WeeklyNoteApi[]>([]);
  const [selectedNote, setSelectedNote] = useState<WeeklyNoteApi | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res: ApiListResponse<WeeklyNoteApi> = await citizenApi.getMyNotes();
      setNotes(res.results || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAudited = (updated: WeeklyNoteApi) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setSelectedNote(updated);
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
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="size-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              Audit Notes
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Review, approve, or request changes to weekly notes before publication.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Notes Pending Review</h2>
            <WeeklyNotesList
              notes={notes}
              onAudit={setSelectedNote}
              showStatusFilter
            />
          </div>
          <div>
            {selectedNote ? (
              <div className="sticky top-28">
                <h2 className="text-lg font-semibold mb-4">
                  Reviewing: {selectedNote.title}
                </h2>
                <WeeklyNoteAuditPanel
                  note={selectedNote}
                  onAudited={handleAudited}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-xl">
                <div className="text-center">
                  <ShieldCheck className="size-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a note to audit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
