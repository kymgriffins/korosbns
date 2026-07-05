# Zero-Gap upgrade log

Chronological record of version bumps and phase completions on `feat/zero-gap-upgrade` → `main`.

---

## v0.2.0 — Foundation (in progress)

**Branch:** `feat/zero-gap-upgrade`  
**Target date:** TBD

### Added
- `docs/zero-gap/TASKPLAN.md` — master upgrade plan
- `docs/zero-gap/LAYER-CONVENTIONS.md` — UI / data / logic separation
- `docs/zero-gap/PAGE-INVENTORY.md` — P0–P3 route list
- `scripts/goldrules-audit.mjs` — mechanical GOLDRULES checks
- `src/motion/motion-tokens.ts` — GOLDRULES §5 token map
- `src/components/patterns/` — pattern library bootstrap
- GOLDRULES template copies under `docs/zero-gap/templates/`

### Metrics baseline (run `pnpm goldrules:audit`)

| Metric | Count | P0 subset |
|--------|------:|----------:|
| Inline `style={{}}` | 41 | 15 |
| Arbitrary Tailwind `[…]` | 287 | 72 |
| Raw palette classes | 131 | — |
| Hardcoded motion duration | 52 | — |

Recorded: 2026-07-05 on `feat/zero-gap-upgrade`.

---

## v0.3.0 — P0 surfaces (planned)

- Task workspace mobile-first + form refactor
- Learn hub: dynamic counts, explicit empty/error
- Auth: full rhf+zod
- 15 P0 checklists signed

---

## v0.4.0 — P1 surfaces (planned)

- Marketing + budget news + forum
- Token/motion debt −60% on P0/P1

---

## Template for future entries

```markdown
## vX.Y.Z — Title (YYYY-MM-DD)

### Shipped
-

### Metrics
| Metric | Before | After |
|--------|--------|-------|

### Checklists completed
-

### Breaking / migration
-
```
