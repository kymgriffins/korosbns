"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Calendar, User } from "lucide-react";
import type { WeeklyNoteApi } from "@/types/notes";
import { format } from "date-fns";
import { sanitizeHtml } from "@/lib/sanitize";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  published: "bg-green-500/10 text-green-600 border-green-500/30",
  archived: "bg-muted text-muted-foreground border-border",
  changes_requested: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

type Props = {
  note: WeeklyNoteApi;
  onAudit?: (note: WeeklyNoteApi) => void;
};

export function WeeklyNoteCard({ note, onAudit }: Props) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold tracking-tight">{note.title}</h3>
          <p className="text-sm text-muted-foreground">{note.week_label}</p>
        </div>
        <Badge
          variant="outline"
          className={statusColors[note.status] || "bg-muted text-muted-foreground"}
        >
          {note.status.replace("_", " ")}
        </Badge>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm dark:prose-invert max-w-none line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content ?? "") }}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="size-3.5" />
          {note.author_name}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {(() => { try { return format(new Date(note.created_at), "MMM d, yyyy"); } catch { return ""; } })()}
        </span>
      </CardFooter>
    </Card>
  );
}
