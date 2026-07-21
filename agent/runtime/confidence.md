# Confidence Engine
## Every decision carries confidence — interrupt only when low

Thresholds in `state.yaml`:

| Threshold | Value | Action |
|-----------|-------|--------|
| `auto_proceed` | ≥ 85% | Execute without human |
| `human_required` | < 70% | STOP — fundamental question |
| Between | 70–84% | Proceed with note in review |

---

## Decision record format

```yaml
decision:
  id: D-001
  action: reuse_component
  target: MobileBottomNav
  confidence: 96
  reason: Contract lms-shell.md lists MobileBottomNav primitive; already used in lms-nav.tsx
  human_required: false

decision:
  id: D-002
  action: refactor_not_create
  target: LmsShell
  confidence: 94
  reason: memory/implemented.md status draft at src/components/lms/lms-shell.tsx
  human_required: false

decision:
  id: D-003
  action: wire_resolveShellMode
  target: learn/layout.tsx
  confidence: 92
  reason: shell/types.ts resolveShellMode exists; layout uses manual isAccount only
  human_required: false

decision:
  id: D-004
  action: create_LmsBottomSheetLayer
  target: shell layer
  confidence: 88
  reason: Contract requires trivia portal host; not in codebase
  human_required: false

decision:
  id: D-005
  action: create_LmsToastLayer
  target: shell layer
  confidence: 85
  reason: Roadmap Phase B item 7; no existing implementation
  human_required: false

decision:
  id: D-006
  action: fix_desktop_nav_active_color
  target: LmsTopNav
  confidence: 78
  reason: Uses bg-primary/10 — learn scope should use lms.css black semantic; minor DNA tension
  human_required: false
  note: Flag for Critic review

decision:
  id: D-007
  action: create_lesson_sidebar
  target: LessonSidebar
  confidence: 8
  reason: Violates Navigation Law — no sidebars
  human_required: true
  blocked: true
```

---

## Aggregate confidence

```yaml
item: LJP-001
decisions_count: 6
blocked_decisions: 0
lowest_confidence: 78
aggregate: 91
human_gates_triggered:
  - user_approval  # approval_required on item, not low confidence
```

---

## Rules

1. **Never execute** decisions with `confidence < 70` without human.
2. **Never execute** `blocked: true` decisions.
3. Log all decisions in `reviews/[item-id].md` or dry-run doc.
4. Critic **must** attempt to lower confidence on weak implementations.
