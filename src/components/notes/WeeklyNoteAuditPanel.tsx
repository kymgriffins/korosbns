"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import { CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react";
import type { WeeklyNoteApi } from "@/types/notes";
import { citizenApi } from "@/lib/api-client";
import { toast } from "sonner";

type Props = {
  note: WeeklyNoteApi;
  onAudited: (note: WeeklyNoteApi) => void;
};

export function WeeklyNoteAuditPanel({ note, onAudited }: Props) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleAudit = async (action: string) => {
    if (!comment.trim() && action !== "approved") {
      toast.error("Please provide a comment");
      return;
    }
    setLoading(action);
    try {
      const updated = await citizenApi.auditWeeklyNote(note.id, action, comment);
      onAudited(updated);
      toast.success(`Note ${action.replace("_", " ")}`);
      setComment("");
    } catch {
      toast.error("Audit action failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Audit Review</h3>
        <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
          {note.status.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audit-comment">Auditor Comment</Label>
        <Textarea
          id="audit-comment"
          rows={4}
          placeholder="Provide feedback for the author..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={() => handleAudit("approved")}
          disabled={loading !== null}
        >
          {loading === "approved" ? (
            <Loader2 className="size-4 mr-1 animate-spin" />
          ) : (
            <CheckCircle className="size-4 mr-1" />
          )}
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleAudit("rejected")}
          disabled={loading !== null}
        >
          {loading === "rejected" ? (
            <Loader2 className="size-4 mr-1 animate-spin" />
          ) : (
            <XCircle className="size-4 mr-1" />
          )}
          Reject
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAudit("changes_requested")}
          disabled={loading !== null}
        >
          {loading === "changes_requested" ? (
            <Loader2 className="size-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="size-4 mr-1" />
          )}
          Request Changes
        </Button>
      </div>
    </div>
  );
}
