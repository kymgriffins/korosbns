# Retrospective: learning-shell — LJP-001

```yaml
capability: learning-shell
spec_id: LJP-001
date: 2026-07-07
owners: [Historian, Librarian]
```

---

## What surprised us?

- Graph query engine was faster to wire than expected; markdown cross-refs still duplicated in loader.
- Layout was not passing immersive mode — caught in dry run, fixed in layout_integration.

---

## Specification gaps?

| Gap | Severity | Action |
|-----|----------|--------|
| Desktop nav duplicate links (Courses/Discover) | low | Fixed — single Catalogue link |
| Toast dual-instance risk | medium | ADR candidate — learn toaster id `learn` |

---

## Engineering gaps?

- Error boundary is class-based; consider `react-error-boundary` package later.
- No e2e/learn shell test yet — add in validated promotion.

---

## Tests missing?

- Shell render smoke test (optional — hub vs immersive).
- E2E: lesson route has no bottom nav.

---

## Contract updates?

```yaml
proposed_bumps: none  # lock was ON
adr_required: [toast-scoping for learn]
```

---

## Anti-pattern additions?

- None.

---

## Future optimizations?

- Sync `agent/graph/*.yaml` → `graph-data.ts` via script.
- Generate markdown views from graph (SDP 3.0 complete milestone).

---

## Outcomes

```yaml
spec_amendments: none
runtime_learnings: capability gates + evidence reviews work
promotion_impact: candidate for runtime draft → validated
sdp_3.0: foundation shipped (query + REQ IDs + provenance headers)
```
