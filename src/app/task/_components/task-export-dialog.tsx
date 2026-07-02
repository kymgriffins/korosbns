"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { generateTaskMarkdown, downloadAsMarkdown, printAsPDF } from "@/lib/task-export";
import type { TaskDetail } from "@/types/tasks";

type ContentSection = "info" | "description" | "checklist" | "audit" | "sections" | "attachments";

const SECTION_LABELS: Record<ContentSection, string> = {
  info: "Task info (status, dates, assignee, team)",
  description: "Description text",
  checklist: "Checklist items (with notes, progress, assignee)",
  audit: "Audit trail",
  sections: "Sections content",
  attachments: "Attachments list",
};

export function TaskExportDialog({ task }: { task: TaskDetail }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selected, setSelected] = useState<Set<ContentSection>>(
    new Set(["info", "description", "checklist", "audit", "sections", "attachments"]),
  );

  function toggle(section: ContentSection) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }

  function buildFilteredTask(): TaskDetail {
    const filtered = { ...task };
    if (!selected.has("info")) {
      filtered.status = undefined as any;
      filtered.author_name = "";
      filtered.created_at = "";
      filtered.updated_at = "";
      filtered.due_date = null;
      filtered.assignee = null;
      filtered.assignee_name = null;
      filtered.assigned_team = null;
      filtered.team_name = null;
      filtered.week_label = "";
      filtered.progress = undefined;
      filtered.priority = undefined;
      filtered.tag = undefined;
    }
    if (!selected.has("description")) {
      filtered.content = "";
    }
    if (!selected.has("checklist")) {
      filtered.checklist = [];
      filtered.checklist_items = [];
    }
    if (!selected.has("audit")) {
      filtered.audit_trails = [];
    }
    if (!selected.has("sections")) {
      filtered.sections = [];
    }
    if (!selected.has("attachments")) {
      filtered.attachments = [];
    }
    return filtered;
  }

  function handleDownloadMarkdown() {
    setExporting(true);
    try {
      const filtered = buildFilteredTask();
      const markdown = generateTaskMarkdown(filtered);
      downloadAsMarkdown(markdown, task.title);
      setOpen(false);
    } finally {
      setExporting(false);
    }
  }

  function handlePrintPDF() {
    setExporting(true);
    try {
      const filtered = buildFilteredTask();
      const markdown = generateTaskMarkdown(filtered);
      downloadAsMarkdown(markdown, task.title);
      setOpen(false);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
          <Download className="size-3.5" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export task</DialogTitle>
          <DialogDescription>
            Select what content to include in the exported file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {(Object.keys(SECTION_LABELS) as ContentSection[]).map((section) => (
            <div key={section} className="flex items-start gap-3">
              <Checkbox
                id={section}
                checked={selected.has(section)}
                onCheckedChange={() => toggle(section)}
                className="mt-0.5"
              />
              <Label htmlFor={section} className="text-sm font-normal leading-5">
                {SECTION_LABELS[section]}
              </Label>
            </div>
          ))}
        </div>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            disabled={exporting || selected.size === 0}
            onClick={handleDownloadMarkdown}
            className="gap-1.5"
          >
            {exporting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileText className="size-3.5" />
            )}
            Download Markdown (.md)
          </Button>
          <Button
            size="sm"
            disabled={exporting || selected.size === 0}
            onClick={() => { setOpen(false); printAsPDF(task.title); }}
            className="gap-1.5"
          >
            {exporting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Open Print PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
