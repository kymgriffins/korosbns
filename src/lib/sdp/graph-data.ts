/**
 * SDP 3.0 — knowledge graph (machine representation).
 * Human docs in docs/ are views; this graph is authoritative for orchestration.
 * @see agent/graph/
 */

export type GraphEntityType =
  | "capability"
  | "component"
  | "contract"
  | "requirement"
  | "intent"
  | "test"
  | "adr";

export type GraphEntity = {
  id: string;
  type: GraphEntityType;
  version?: string;
  meta?: Record<string, unknown>;
};

export type GraphEdge = {
  from: string;
  rel:
    | "USES"
    | "IMPLEMENTS"
    | "DEPENDS_ON"
    | "SATISFIES"
    | "VERIFIED_BY"
    | "TESTED_BY"
    | "BELONGS_TO"
    | "CONTAINS";
  to: string;
};

export const ENTITIES: GraphEntity[] = [
  { id: "INTENT-001", type: "intent", meta: { title: "Learning Journey Platform shell" } },
  { id: "CAP-learning-shell", type: "capability", meta: { spec_id: "LJP-001" } },
  { id: "CMP-LearningShell", type: "component", version: "1.0.0" },
  { id: "CMP-LmsTopNav", type: "component", version: "1.0.0" },
  { id: "CMP-LmsBottomNav", type: "component", version: "1.0.0" },
  { id: "CTR-lms-shell", type: "contract", version: "1.0.0" },
  { id: "CTR-navigation-laws", type: "contract", version: "1.0.0" },
  { id: "REQ-0001", type: "requirement", meta: { text: "No sidebar navigation in learn" } },
  { id: "REQ-0003", type: "requirement", meta: { text: "Mobile bottom nav max 5 items" } },
  { id: "REQ-0012", type: "requirement", meta: { text: "Lesson routes hide bottom nav (immersive)" } },
  { id: "REQ-0014", type: "requirement", meta: { text: "Account routes bypass learn shell" } },
  { id: "CAP-learning-runtime", type: "capability", meta: { spec_id: "LJP-002" } },
  { id: "CMP-LearningRuntime", type: "component", version: "1.0.0" },
  { id: "CTR-learning-runtime", type: "contract", version: "1.0.0" },
  { id: "REQ-0100", type: "requirement" },
  { id: "REQ-0101", type: "requirement" },
  { id: "TST-learning-runtime", type: "test" },
];

export const EDGES: GraphEdge[] = [
  { from: "CAP-learning-shell", rel: "IMPLEMENTS", to: "CTR-lms-shell" },
  { from: "CAP-learning-shell", rel: "DEPENDS_ON", to: "CTR-navigation-laws" },
  { from: "CAP-learning-runtime", rel: "IMPLEMENTS", to: "CTR-learning-runtime" },
  { from: "CAP-learning-runtime", rel: "DEPENDS_ON", to: "CAP-learning-shell" },
  { from: "CMP-LearningRuntime", rel: "IMPLEMENTS", to: "CTR-learning-runtime" },
  { from: "CMP-LearningRuntime", rel: "SATISFIES", to: "REQ-0100" },
  { from: "CMP-LearningRuntime", rel: "SATISFIES", to: "REQ-0101" },
  { from: "CAP-learning-runtime", rel: "CONTAINS", to: "CMP-LearningRuntime" },
  { from: "TST-learning-runtime", rel: "VERIFIED_BY", to: "CMP-LearningRuntime" },
  { from: "CMP-LearningShell", rel: "IMPLEMENTS", to: "CTR-lms-shell" },
  { from: "CMP-LearningShell", rel: "SATISFIES", to: "REQ-0012" },
  { from: "CMP-LearningShell", rel: "SATISFIES", to: "REQ-0014" },
  { from: "CMP-LmsBottomNav", rel: "SATISFIES", to: "REQ-0003" },
  { from: "CMP-LmsTopNav", rel: "SATISFIES", to: "REQ-0001" },
  { from: "CMP-LearningShell", rel: "USES", to: "CMP-LmsTopNav" },
  { from: "CMP-LearningShell", rel: "USES", to: "CMP-LmsBottomNav" },
  { from: "CAP-learning-shell", rel: "CONTAINS", to: "CMP-LearningShell" },
  { from: "INTENT-001", rel: "BELONGS_TO", to: "CAP-learning-shell" },
  { from: "TST-resolve-shell-mode", rel: "VERIFIED_BY", to: "CMP-LearningShell" },
];
