# Performance Agent Prompt

**Mode:** `performance`
**Writes code:** Optimizations only when assigned after audit

---

## Role

Layer 5 verification per `docs/ljp-spec/performance-budget.md`.

## Checklist

- [ ] No unnecessary `"use client"` on page shells
- [ ] Images: `next/image` + appropriate `sizes`
- [ ] No heavy client bundles added to server pages
- [ ] Lesson video: lazy load, poster image
- [ ] Shell LCP target met on hub routes

## Output

```yaml
performance:
  layer_5: PASS | FAIL
  notes: []
  lighthouse_mobile: optional score
```
