# Production Readiness Audit — Learning Hub

## Architecture Verdict

**Not production-ready for scale.** The learning hub has fundamental architecture issues that prevent it from scaling beyond the current 8-stage hardcoded model.

## Critical Blockers

### 1. `8` Hardcoded Everywhere
Every file that touches progress assumes exactly 8 stages:
- `learn-paths-home.tsx` — progress denominator (`badges.length / 8`), navigation boundaries (`order < 8`, `order > 1`), reset loop (`for i = 1; i <= 8`)
- `stage-detail-drawer.tsx` — unlock gate (`nextStageId <= 8`), all-stages bonus (`newProgress.length === 8`)
- `LearnHubLayout.tsx` — `ALL_STAGES` array with exactly 3 hardcoded entries
- `learn-stats-sidebar.tsx` — SVG ring denominator `/ 8`, text "Master all 8 stages"
- `documents-registry.ts` — `STAGE_FOLDER_MAP` only covers stages 2-7

### 2. Content Bundled in Client
`constants/stages-data.ts` ships 1187 lines of full curriculum content (text, transcript, trivia). For 1000+ units this approach fails — bundle would be megabytes.

### 3. localStorage Key Explosion
Each step generates 3-5 localStorage keys (`stage_N_current_step`, `stage_N_step_M_trivia_passed`, etc.). 1000 stages × 5 steps × 3 trivia = 15,000+ keys.

### 4. `currentStep` Always 0
Curriculum rail step highlight never updates — `ActiveLesson.currentStep` is set once on stage selection and never synced from `StageDetailDrawer`'s internal state.

### 5. Two Parallel Data Models
`CivicModule` (stage journey, partially hardcoded) and `LearningUnit` (unit grid, fully API-driven) are not unified. API is attempted for stages but silently falls back to 8 hardcoded stages.

### 6. Fallback Hides API Gaps
`STAGES_DATA` fallback in `learn-paths-home.tsx` silently activates when API returns empty. No error state, no loading indicator.

## Action Plan

1. Lift civic modules data into `LearnContext` — sidebar gets dynamic stage list from API
2. Replace `ALL_STAGES` hardcoded array with context data
3. Sync `currentStep` from `StageDetailDrawer` to context on each step change
4. Replace all hardcoded `8` denominators with dynamic counts from API
5. Refactor localStorage to single blob per module instead of key-per-step
6. Remove `STAGES_DATA` as fallback — API is single source of truth
