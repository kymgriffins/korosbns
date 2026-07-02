import { format } from "date-fns";
import type { TaskDetail, WeeklyReportData } from "@/types/tasks";

function safeFormat(date: string | Date | undefined | null, fmt: string, fallback = ""): string {
  if (!date) return fallback;
  try { const d = new Date(date); if (isNaN(d.getTime())) return fallback; return format(d, fmt); }
  catch { return fallback; }
}

export function generateTaskMarkdown(task: TaskDetail): string {
  const lines: string[] = [];

  lines.push(`# ${task.title}`);
  lines.push("");
  lines.push(`**Status:** ${task.status}`);
  lines.push(`**Author:** ${task.author_name}`);
  lines.push(`**Created:** ${safeFormat(task.created_at, "MMM d, yyyy")}`);
  if (task.due_date) lines.push(`**Due:** ${safeFormat(task.due_date, "MMM d, yyyy")}`);
  if (task.assignee_name || task.assignee) lines.push(`**Assignee:** ${task.assignee_name || task.assignee}`);
  if (task.assigned_team) lines.push(`**Team:** ${task.assigned_team}`);
  if (task.week_label) lines.push(`**Week:** ${task.week_label}`);
  if (typeof task.progress === "number") lines.push(`**Progress:** ${task.progress}%`);
  lines.push("");

  if (task.content) {
    lines.push("## Description");
    lines.push("");
    lines.push(task.content);
    lines.push("");
  }

  if (task.checklist && task.checklist.length > 0) {
    lines.push("## Checklist");
    lines.push("");
    for (const item of task.checklist) {
      const label = item.title || item.text;
      const done = item.checked || item.status === "done";
      lines.push(`- [${done ? "x" : " "}] ${label}`);
      if (item.status && item.status !== "todo") {
        lines.push(`  - Status: ${item.status.replace("_", " ")}`);
      }
      if (item.assignee_name) lines.push(`  - Assignee: ${item.assignee_name}`);
      if (item.due_date) lines.push(`  - Due: ${safeFormat(item.due_date, "MMM d, yyyy")}`);
      if (item.priority) lines.push(`  - Priority: ${item.priority}`);
      if (typeof item.progress === "number") lines.push(`  - Progress: ${item.progress}%`);
      if (item.description_text?.trim()) {
        lines.push(`  - Notes: ${item.description_text.trim()}`);
      }
      if (item.attachments && item.attachments.length > 0) {
        for (const att of item.attachments) {
          lines.push(`  - Attachment: ${att.file_name}`);
        }
      }
    }
    lines.push("");
  }

  if (task.audit_trails && task.audit_trails.length > 0) {
    lines.push("## Audit Trail");
    lines.push("");
    for (const trail of task.audit_trails) {
      lines.push(`- **${trail.action}** (${safeFormat(trail.created_at, "MMM d, HH:mm")})`);
      if (trail.comment) lines.push(`  ${trail.comment}`);
    }
    lines.push("");
  }

  if (task.sections && task.sections.length > 0) {
    lines.push("## Sections");
    lines.push("");
    for (const section of task.sections) {
      lines.push(`### ${section.heading}`);
      lines.push("");
      lines.push(JSON.stringify(section.content, null, 2));
      lines.push("");
    }
  }

  if (task.attachments && task.attachments.length > 0) {
    lines.push("## Attachments");
    lines.push("");
    for (const att of task.attachments) {
      lines.push(`- ${att.file_name} (${(att.file_size / 1024).toFixed(0)} KB)`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(`*Exported on ${format(new Date(), "yyyy-MM-dd HH:mm")}*`);

  return lines.join("\n");
}

export function generateReportMarkdown(report: WeeklyReportData): string {
  const lines: string[] = [];

  lines.push("# Weekly Task Report");
  lines.push("");
  lines.push(`**Period:** ${report.period}`);
  lines.push(`**Total Tasks:** ${report.total}`);
  lines.push(`**Average Progress:** ${report.avg_progress}%`);
  lines.push("");

  lines.push("## Status Breakdown");
  lines.push("");
  lines.push(`| Status | Count |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Draft | ${report.by_status.draft ?? 0} |`);
  lines.push(`| In Progress | ${report.by_status.audited ?? 0} |`);
  lines.push(`| Published | ${report.by_status.published ?? 0} |`);
  lines.push("");

  if (Object.keys(report.by_team).length > 0) {
    lines.push("## By Team");
    lines.push("");
    lines.push(`| Team | Count | Share |`);
    lines.push(`|------|------:|-----:|`);
    for (const [, data] of Object.entries(report.by_team)) {
      const pct = report.total > 0 ? ((data.count / report.total) * 100).toFixed(1) : "0";
      lines.push(`| ${data.name} | ${data.count} | ${pct}% |`);
    }
    lines.push("");
  }

  if (Object.keys(report.by_assignee).length > 0) {
    lines.push("## By Assignee");
    lines.push("");
    lines.push(`| Assignee | Tasks |`);
    lines.push(`|----------|------:|`);
    for (const [email, count] of Object.entries(report.by_assignee).sort(([, a], [, b]) => b - a)) {
      lines.push(`| ${email} | ${count} |`);
    }
    lines.push("");
  }

  const publishedRate = report.total > 0 ? Math.round(((report.by_status.published ?? 0) / report.total) * 100) : 0;
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Published Rate:** ${publishedRate}%`);
  lines.push(`- **Draft Rate:** ${report.total > 0 ? Math.round(((report.by_status.draft ?? 0) / report.total) * 100) : 0}%`);
  lines.push(`- **In Progress Rate:** ${report.total > 0 ? Math.round(((report.by_status.audited ?? 0) / report.total) * 100) : 0}%`);
  lines.push("");

  lines.push("---");
  lines.push(`*Exported on ${format(new Date(), "yyyy-MM-dd HH:mm")}*`);

  return lines.join("\n");
}

export function downloadAsMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printAsPDF(title: string) {
  const originalTitle = document.title;
  document.title = title;
  window.print();
  document.title = originalTitle;
}
