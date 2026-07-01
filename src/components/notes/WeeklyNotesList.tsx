"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { WeeklyNoteCard } from "./WeeklyNoteCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import type { WeeklyNoteApi } from "@/types/notes";

type Props = {
  notes: WeeklyNoteApi[];
  onAudit?: (note: WeeklyNoteApi) => void;
  showStatusFilter?: boolean;
};

const statusFilters = ["all", "draft", "published", "changes_requested", "approved"];

export function WeeklyNotesList({ notes, onAudit, showStatusFilter = true }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        !search ||
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        (note.content ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || note.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [notes, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {showStatusFilter && (
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Filter className="size-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No notes found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((note) => (
            <motion.div key={note.id} variants={fadeInUp}>
              <WeeklyNoteCard note={note} onAudit={onAudit} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
