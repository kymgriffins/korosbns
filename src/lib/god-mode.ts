/**
 * God Mode Authorization & CRUD Approval Engine for Budget Ndio Story.
 * 
 * Rules:
 * - `info@budgetndiostory.org` is the Master God Mode Approver.
 * - Any user can perform/submit CRUD tasks (CREATE, UPDATE, DELETE, TRANSITION, ROLE_ASSIGNMENT).
 * - All admin/data changes require explicit Approval (ALLOW) or Denial (DENY) from `info@budgetndiostory.org`.
 */

export const GOD_MODE_EMAIL = "info@budgetndiostory.org";

export type CrudActionType = "CREATE" | "UPDATE" | "DELETE" | "TRANSITION" | "ROLE_ASSIGNMENT" | "PUBLISH";

export type CrudResourceType =
  | "civic_module"
  | "weekly_note"
  | "survey"
  | "trivia"
  | "user_role"
  | "budget_record"
  | "doc_file"
  | "programme_content";

export type PendingApprovalStatus = "PENDING" | "APPROVED" | "DENIED";

export type PendingApprovalRequest = {
  id: string;
  action: CrudActionType;
  resource: CrudResourceType;
  targetTitle: string;
  requestedBy: string;
  requestedByRole: string;
  status: PendingApprovalStatus;
  timestamp: string;
  reason?: string;
  payloadSummary: string;
};

// Initial seeded pending requests for instant audit & user testing
const DEFAULT_PENDING_REQUESTS: PendingApprovalRequest[] = [
  {
    id: "req-001",
    action: "PUBLISH",
    resource: "civic_module",
    targetTitle: "FY2026/27 County Health Allocation Breakdown",
    requestedBy: "editor@budgetndiostory.org",
    requestedByRole: "Content Editor",
    status: "PENDING",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    payloadSummary: "Publish new 4-chapter civic learning module covering county healthcare spending.",
  },
  {
    id: "req-002",
    action: "ROLE_ASSIGNMENT",
    resource: "user_role",
    targetTitle: "Assign Manager Role to pec.koros@budgetndiostory.org",
    requestedBy: "admin@budgetndiostory.org",
    requestedByRole: "System Administrator",
    status: "PENDING",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    payloadSummary: "Promote user account to Operations Manager role with chapter transition privileges.",
  },
  {
    id: "req-003",
    action: "DELETE",
    resource: "budget_record",
    targetTitle: "Legacy FY2021 Draft Revenue Allocation Dataset",
    requestedBy: "manager@budgetndiostory.org",
    requestedByRole: "Operations Manager",
    status: "PENDING",
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    payloadSummary: "Remove outdated unverified draft allocation file from document repository.",
  },
  {
    id: "req-004",
    action: "CREATE",
    resource: "survey",
    targetTitle: "Q3 Youth Public Participation & Tax Equity Survey",
    requestedBy: "editor@budgetndiostory.org",
    requestedByRole: "Content Editor",
    status: "PENDING",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    payloadSummary: "Create 6-question citizen feedback survey for BNS Connect network.",
  },
];

let _requests: PendingApprovalRequest[] = [...DEFAULT_PENDING_REQUESTS];

export const godModeStore = {
  getRequests: (): PendingApprovalRequest[] => [..._requests],

  getPendingCount: (): number => _requests.filter((r) => r.status === "PENDING").length,

  submitRequest: (
    action: CrudActionType,
    resource: CrudResourceType,
    targetTitle: string,
    requestedBy: string,
    requestedByRole: string,
    payloadSummary: string,
  ): PendingApprovalRequest => {
    const newReq: PendingApprovalRequest = {
      id: `req-${Date.now()}`,
      action,
      resource,
      targetTitle,
      requestedBy,
      requestedByRole,
      status: "PENDING",
      timestamp: new Date().toISOString(),
      payloadSummary,
    };
    _requests.unshift(newReq);
    return newReq;
  },

  approveRequest: (id: string, approverEmail: string): boolean => {
    if (approverEmail.toLowerCase() !== GOD_MODE_EMAIL.toLowerCase()) {
      throw new Error(`Only God Mode master email (${GOD_MODE_EMAIL}) can approve CRUD requests.`);
    }
    const idx = _requests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      _requests[idx] = { ..._requests[idx], status: "APPROVED" };
      return true;
    }
    return false;
  },

  denyRequest: (id: string, approverEmail: string, reason: string): boolean => {
    if (approverEmail.toLowerCase() !== GOD_MODE_EMAIL.toLowerCase()) {
      throw new Error(`Only God Mode master email (${GOD_MODE_EMAIL}) can deny CRUD requests.`);
    }
    const idx = _requests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      _requests[idx] = { ..._requests[idx], status: "DENIED", reason };
      return true;
    }
    return false;
  },

  isGodMode: (email?: string): boolean => {
    if (!email) return true; // Default true in demo mode for info@budgetndiostory.org
    return email.toLowerCase() === GOD_MODE_EMAIL.toLowerCase();
  },
};
