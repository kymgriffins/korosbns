# Rollback Protocol
## When verification fails or risk materializes

---

## Triggers

```yaml
rollback_if:
  - verification layer fails twice on same item
  - production regression attributed to item
  - human rejects user_approval
  - risk materialized (shell broken on all routes)
```

---

## Levels

| Level | Action |
|-------|--------|
| 1 — Local | `git checkout -- <files>` on scoped diff |
| 2 — Item | Revert feature commit; set `implementation: pending` |
| 3 — Release | Move `release_stage` back one stage |
| 4 — Architecture | STOP all parallel work on dependent graph nodes |

---

## Procedure

```
1. STOP scheduler — set active_item implementation: in_progress → pending
2. Document failure in reviews/[item-id].md status BLOCKED
3. IF uncommitted → Level 1
4. IF committed AND not pushed → git revert HEAD (new commit, not amend unless rules allow)
5. IF pushed → human decides; never force-push main
6. UPDATE state.yaml — reset failed layers to pending
7. UPDATE memory/implemented.md — revert status if needed
8. NOTIFY Reporter → human summary
9. DO NOT start dependent items (blocked_by propagates)
```

---

## LJP-001 rollback scope

```yaml
critical_files:
  - src/app/(marketing)/learn/layout.tsx
  - src/components/lms/lms-shell.tsx
  - src/components/lms/lms-nav.tsx
  - src/components/lms/shell/*

safe_rollback:
  - Draft UI pages unaffected if shell reverts to 0.9 behavior
  - Account routes must still work without shell

test_gate:
  - pnpm test src/data/lms  # must pass after rollback
```

---

## Post-rollback

- Planner re-runs with failure context
- Critic documents root cause
- Historian logs in decision-log if pattern failure
