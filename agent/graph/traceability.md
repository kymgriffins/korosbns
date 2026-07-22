# Traceability Chain

Every implementation must answer:

```
Requirement → Contract → Capability → Component → Test → Evidence
```

## Example (shell)

```
REQ-0012
  ↓ SATISFIES
CMP-LearningShell
  ↓ IMPLEMENTS
CTR-lms-shell@1.0.0
  ↓ CONTAINS
CAP-learning-shell
  ↓ VERIFIED_BY
TST-resolve-shell-mode
  ↓ EVIDENCE
reviews/LJP-001.md — layout uses resolveShellMode → immersive
```

## Incomplete if missing

If any link is null → implementation incomplete (manifest law #0).

Provenance header on source files: `@sdp-provenance` in JSDoc.
