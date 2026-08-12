"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Plus,
  Trash2,
  Edit,
  Share2,
  Lock,
  Key,
  Sparkles,
} from "lucide-react";
import {
  godModeStore,
  GOD_MODE_EMAIL,
  type PendingApprovalRequest,
  type CrudActionType,
} from "@/lib/god-mode";

type Props = {
  currentEmail?: string;
  onStateChange?: () => void;
};

const ACTION_ICONS: Record<CrudActionType, React.ReactNode> = {
  CREATE: <Plus className="size-3.5 text-emerald-500" />,
  UPDATE: <Edit className="size-3.5 text-blue-500" />,
  DELETE: <Trash2 className="size-3.5 text-rose-500" />,
  TRANSITION: <Share2 className="size-3.5 text-amber-500" />,
  ROLE_ASSIGNMENT: <Key className="size-3.5 text-purple-500" />,
  PUBLISH: <CheckCircle2 className="size-3.5 text-teal-500" />,
};

export function GodModeApprovalBanner({ currentEmail = GOD_MODE_EMAIL, onStateChange }: Props) {
  const [requests, setRequests] = useState<PendingApprovalRequest[]>(godModeStore.getRequests());
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [denialReasonMap, setDenialReasonMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "submit">("pending");

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const handleApprove = (id: string) => {
    godModeStore.approveRequest(id, GOD_MODE_EMAIL);
    const updated = godModeStore.getRequests();
    setRequests(updated);
    if (onStateChange) onStateChange();
  };

  const handleDeny = (id: string) => {
    const reason = denialReasonMap[id] || "Changes denied by God Mode Approver (info@budgetndiostory.org)";
    godModeStore.denyRequest(id, GOD_MODE_EMAIL, reason);
    const updated = godModeStore.getRequests();
    setRequests(updated);
    if (onStateChange) onStateChange();
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    godModeStore.submitRequest(
      "UPDATE",
      "civic_module",
      newTitle.trim(),
      "editor@budgetndiostory.org",
      "Content Editor",
      newSummary.trim(),
    );

    setNewTitle("");
    setNewSummary("");
    setIsSubmitting(false);
    setActiveTab("pending");
    setRequests(godModeStore.getRequests());
    if (onStateChange) onStateChange();
  };

  const visibleRequests =
    activeTab === "pending"
      ? requests.filter((r) => r.status === "PENDING")
      : requests;

  return (
    <div className="rounded-2xl border border-primary/30 bg-card shadow-lg p-5 space-y-5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Lock className="size-44 text-primary" />
      </div>

      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                God Mode Authorization Engine
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Approver: <strong className="text-foreground">{GOD_MODE_EMAIL}</strong>
              </span>
            </div>
            <h3 className="text-lg font-bold font-heading text-foreground mt-0.5">
              CRUD Action Approval Queue & Governance Controls
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-background text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Pending Approvals</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-amber-950 font-extrabold text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Audit Logs ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === "submit"
                ? "bg-background text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="size-3.5 text-primary" />
            <span>Simulate User Change</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "submit" ? (
        <form onSubmit={handleCreateNewRequest} className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/60">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>Simulate User CRUD Change Request (Submitted to {GOD_MODE_EMAIL} for Approval)</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Action Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Update Kakamega County Healthcare Allocation Scorecard"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Change Summary / Details</label>
              <textarea
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="e.g. Modify budget execution numbers for FY2025/26."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary h-20"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Request for Approval
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3 relative z-10">
          {visibleRequests.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              <CheckCircle2 className="size-8 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="font-semibold text-foreground">No Pending CRUD Requests</p>
              <p>All administrative changes have been processed by {GOD_MODE_EMAIL}.</p>
            </div>
          ) : (
            visibleRequests.map((req) => {
              const isPending = req.status === "PENDING";
              const isApproved = req.status === "APPROVED";
              const isDenied = req.status === "DENIED";

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isPending
                      ? "border-amber-500/30 bg-amber-500/5"
                      : isApproved
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-rose-500/30 bg-rose-500/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-background border border-border shrink-0">
                        {ACTION_ICONS[req.action]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{req.targetTitle}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="size-3 text-primary" />
                            <span>{req.requestedBy}</span> ({req.requestedByRole})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock className="size-3" />
                            <span>{new Date(req.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isPending
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : isApproved
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-1">{req.payloadSummary}</p>

                  {/* Denial Reason if Denied */}
                  {isDenied && req.reason && (
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-500/20">
                      Denial Reason: {req.reason}
                    </div>
                  )}

                  {/* Interactive Approve / Deny Actions for God Mode User */}
                  {isPending && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Optional denial note for requester..."
                          value={denialReasonMap[req.id] || ""}
                          onChange={(e) =>
                            setDenialReasonMap({ ...denialReasonMap, [req.id]: e.target.value })
                          }
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-border/80 bg-background text-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeny(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                        >
                          <XCircle className="size-3.5" />
                          <span>DENY CHANGE</span>
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>ALLOW & AUTHORIZE</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
