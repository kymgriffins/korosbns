# PRD: Learn hub

Status: `Approved` · Parent: [TASKPLAN](../TASKPLAN.md)

## Problem
Learn hub had hardcoded stage counts, silent API fallbacks, and inconsistent loading/error UX per production-audit.

## In scope
- `/learn` dashboard, module reader, profile, account
- Dynamic `totalStages` from API
- Explicit loading, empty, error states
- Motion via `motionTokens`

## Out of scope
- Full content CDN migration (Phase 5)
- localStorage blob refactor (Phase 5)

## Page inventory
See [PAGE-INVENTORY](../PAGE-INVENTORY.md) rows 6–9.

## Success
- No hardcoded `8` in progress denominators
- `modulesError` surfaced with retry
- P0 learn specs signed
