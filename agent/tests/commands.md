# Verification Commands
## ADOS test manifest — Layer 1–3 automation

Run from repository root: `C:\BudgetNdioStory\korosbns`

---

## Layer 1 — Compilation

```powershell
pnpm exec tsc --noEmit
```

**Pass:** exit code 0

---

## Layer 2 — Lint

```powershell
# IDE: read_lints on changed files
# Or if eslint script exists:
pnpm lint
```

**Pass:** no new errors in changed files

---

## Layer 3 — Tests (full)

```powershell
pnpm test
```

## Layer 3 — Tests (LMS scoped)

```powershell
pnpm test src/data/lms
pnpm test src/components/lms
```

**Pass:** all tests green

---

## Layer 3 — Single file

```powershell
pnpm test src/data/lms/__tests__/helpers.test.ts
```

---

## Future CI script

```powershell
# agent/tests/run-verification.ps1 (future)
pnpm exec tsc --noEmit
if ($LASTEXITCODE -ne 0) { exit 1 }
pnpm test src/data/lms src/components/lms
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Layers 1-3 PASS. Run Review Agent for layers 4-9."
```

---

## Layers 4–9

Manual / agent-driven per:

- `agent/verification.md`
- `agent/prompts/accessibility-agent.md`
- `agent/prompts/performance-agent.md`
- `agent/prompts/review-agent.md`

---

## E2E (when implemented)

```powershell
# Per e2e/learn/README.md
pnpm exec playwright test e2e/learn
```

---

## Pre-commit checklist (Release Agent)

```yaml
- tsc --noEmit: PASS
- pnpm test: PASS
- reviews/[item-id].md: PASS
- memory/implemented.md: updated
- backlog item: done
```
