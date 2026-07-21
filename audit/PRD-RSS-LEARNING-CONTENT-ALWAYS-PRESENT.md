# PRD — RSS Video → Learning Modules (Always-Present Content)

**Doc id:** `PRD-RSS-LEARNING-ALWAYS-PRESENT-2026-07`  
**Version:** 1.0  
**Status:** Wave A shipping — interval gate + populate + always-present fallbacks  
**Owner:** Paid content ops (Budget Ndio Story)  
**Stack:** Django `bnske` (source of truth) · Next.js `korosbns` (always-visible catalogue)  
**Companions:** [`PRD-YOUTUBE-CONTENT-PIPELINE.md`](./PRD-YOUTUBE-CONTENT-PIPELINE.md) · [`PRD-LMS-BUDGET-HUB.md`](./PRD-LMS-BUDGET-HUB.md) · [`PROGRESSIVE-UPGRADE.md`](./PROGRESSIVE-UPGRADE.md)

### Wave A — Schedule + durability contract (this PRD’s first build slice)

1. [x] `YOUTUBE_PIPELINE_INTERVAL_HOURS` + `--respect-interval` on `run_youtube_content_pipeline`
2. [x] Persist last-success timestamp (`data/youtube_pipeline_last_success.json`); ops-visible via file
3. [x] Document cPanel cron with interval gate (see §4.3)
4. [x] Fallback: Published BPS module rows with Part 1–3 YouTube URLs in `civic-modules.json`
5. [x] Tests: interval skip / zero-hours / idempotent part mapping

---

## 1. Problem

YouTube series (Part 1 … Part N) are the raw material for civic learning modules. Today the pipeline can sync, transcribe, and stub — but **learning content is not yet contractually always present** across:

1. **Ingest cadence** — daily check after a configurable interval (`X` hours), not ad-hoc runs only  
2. **Module completeness** — every series Part 1…N becomes a chapter with developed content  
3. **Dual-stack durability** — Django holds authoritative data; Next.js never ships an empty Learn Hub when the API is slow or down  

This PRD is the paid deliverable contract: **every ingested video’s learning payload remains discoverable and renderable forever** (soft-delete / archive allowed; hard loss of catalogue rows is a P0 incident).

---

## 2. Goal (one sentence)

Every day, after `X` hours since the last successful run, auto-check the channel RSS for new videos; for each available series, create/update a civic module with chapters Part 1…N; develop each chapter from transcript text; and keep that full payload **always present** in Django **and** in Next.js learning surfaces (live API or shipped fallback).

```
[Cron: every day / after X hours]
        ↓
RSS check → new/updated YouTubeVideo rows
        ↓
Transcript fetch → Transcript + TranscriptChunk
        ↓
Series group (Part 1…N) → CivicModule + CivicChapter stubs
        ↓
Content develop (excerpt → draft chapter body; numbers flagged)
        ↓
Publish gate → Learn Hub API
        ↓
Next.js: live fetch OR seeded fallback (never blank)
```

---

## 3. Non-negotiables (“always ever present”)

| # | Rule | Failure mode |
|---|------|--------------|
| N1 | **Django is source of truth** for videos, transcripts, modules, chapters | Frontend invents modules without DB rows |
| N2 | **Next.js never blanks** public Learn Hub when API fails | Empty shell / spinner forever |
| N3 | **Accumulate, don’t replace** — RSS merge into JSON + DB; never wipe catalogue on a short Atom window | Losing older Part videos because RSS only returns ~15 |
| N4 | **Part 1…N integrity** — a series module lists every known part; missing parts are explicit gaps, not silent drops | Module shows Part 1+3 and hides Part 2 |
| N5 | **Transcript provenance** — chapter copy cites transcript; no invented fiscal figures | Fake budget numbers in published text |
| N6 | **Idempotent pipeline** — re-runs do not duplicate modules/chapters/videos | Duplicate slugs / chapters on every cron |
| N7 | **Soft retention** — soft-delete only; restore path exists; hard delete requires explicit admin action | Accidental permanent data loss |
| N8 | **Fallback freshness** — when modules publish, regenerate/commit or CI-sync `civic-modules` (and related) JSON fallbacks | Live API has content; offline fallback is stale/empty |

---

## 4. Configurable schedule: “every day after X hours”

### 4.1 Intent

Operators set **`X`** = minimum hours between successful full pipeline runs (default **24**). Cron may wake more often; the job **no-ops** if last success was &lt; `X` hours ago (via `CronLock` / last-success timestamp).

### 4.2 Settings (Django)

| Setting | Default | Meaning |
|---------|---------|---------|
| `YOUTUBE_PIPELINE_INTERVAL_HOURS` | `24` | `X` — skip run if last success &lt; X hours |
| `YOUTUBE_RSS_MAX_ENTRIES` | `15` | Atom window size (YouTube limit ~15) |
| `YOUTUBE_TRANSCRIPT_BATCH_LIMIT` | `10` | Max new transcripts per run (fair use) |
| `YOUTUBE_PIPELINE_AUTO_APPLY_MAP` | `false` | If true, write chapter YouTube URLs without human `--apply` |
| `YOUTUBE_PIPELINE_AUTO_PUBLISH` | `false` | If true, auto-publish drafts that pass Level-1 gate (Wave 3+) |

### 4.3 Cron (cPanel)

```text
# Wake daily (or every few hours); command enforces X-hour gate
0 */6 * * *  cd /path/to/bnske && python manage.py run_youtube_content_pipeline \
  --import-json --transcript-limit 10 \
  --respect-interval
```

`--respect-interval` (required by this PRD): read last successful run; exit 0 with `skipped: interval` if now − last_success &lt; `X` hours.

Lock: existing `CronLock` so overlapping cron ticks never double-write.

### 4.4 Success / skip telemetry

Each run writes an ops row (or extends existing audit log) with:

- `started_at`, `finished_at`, `status` ∈ `{success, partial, skipped, failed}`  
- counts: `videos_seen`, `videos_new`, `transcripts_fetched`, `series_stubbed`, `chapters_mapped`  
- `skip_reason` when interval gate trips  

Admin dashboard (or Django admin) must show **last success age** so paid ops can prove the daily check is alive.

---

## 5. Functional requirements

### 5.1 RSS ingest

| ID | Requirement |
|----|-------------|
| F1 | Pull channel Atom RSS; upsert `YouTubeSource` + `YouTubeVideo` by `video_id` |
| F2 | Merge into durable `data/content_videos.json` (accumulate; never truncate to last 15 only) |
| F3 | `--import-json` path loads full catalogue into DB when RSS window is incomplete |
| F4 | New videos enqueue for transcript fetch (`Transcript` missing or empty) |

**Known limit:** RSS alone ≠ full channel history. Full history = long-lived JSON merge **and/or** YouTube Data API (Wave 3). Until then, N3 still applies to everything ever seen by RSS/JSON.

### 5.2 Transcription → developed content

| ID | Requirement |
|----|-------------|
| F5 | Fetch transcript via `youtube-transcript.ai` HTTP client; store on `Transcript` |
| F6 | Chunk into `TranscriptChunk`; mark `is_processed` after knowledge/draft pass |
| F7 | Chapter stub fields from transcript only: headline, summary bullets, excerpt |
| F8 | Flag numeric-looking tokens as `numbers_flagged` for human Level-1 review |
| F9 | Failed transcript fetches retry next eligible run; do not drop the video row |

### 5.3 Module creation (Part 1 → Part N)

| ID | Requirement |
|----|-------------|
| F10 | Group videos by normalized series title (`normalize_series_title`) |
| F11 | Map `PART k` → chapter order `k` (letter A…Z for display; support Part 4+) |
| F12 | Titles without `PART` default to Part 1 |
| F13 | One `CivicModule` (or stub pending apply) per series; one `CivicChapter` per part |
| F14 | BPS series: Part A/B/C → chapter orders 1/2/3; chapter 1 holds ordered `youtube_urls` list |
| F15 | Idempotent upsert by series slug + chapter order |
| F16 | Partial series (e.g. only Part 1+2 live): module still published with available parts; missing parts listed as `pending` in admin, not fabricated |

### 5.4 Django ↔ Next.js always-present contract

| ID | Requirement |
|----|-------------|
| F17 | Public APIs: `/api/v1/content/civic-modules/` (+ detail by slug) return full module + steps with youtube URLs / text when published |
| F18 | Next.js Learn Hub uses ISR / short revalidate for catalogue GETs; mutations stay `no-store` |
| F19 | On API failure/timeout, hydrate from `src/data/fallbacks/civic-modules.json` (and peer learn fallbacks) |
| F20 | Fallback JSON must include **at least** every **Published** module that learners expect offline — regenerate after publish waves |
| F21 | Types in `src/types/learn.ts` stay aligned with DRF serializers (breaking API changes = coordinated PR) |
| F22 | Immersive routes (`watch` / `read` / `quiz`) never depend on a second live hop for core chapter text if fallback already has it |

### 5.5 Safety & publishing

| ID | Requirement |
|----|-------------|
| F23 | Default: map/publish dry-run; mutating chapter bodies requires explicit apply/overwrite flags |
| F24 | Published `ContentUnit` bodies protected unless `--overwrite-published` |
| F25 | Auto-publish only when `YOUTUBE_PIPELINE_AUTO_PUBLISH` and Level-1 number gate pass (future wave) |

---

## 6. Data model (authoritative)

Already in Django (`content.models`):

| Entity | Role in this PRD |
|--------|------------------|
| `YouTubeSource` | Channel RSS identity |
| `YouTubeVideo` | One row per video — **never hard-deleted by cron** |
| `Transcript` / `TranscriptChunk` | Raw + chunked speech → learning text |
| `CivicModule` / `CivicChapter` | Learner-facing Part 1…N structure |
| `ContentUnit` (optional) | Article body linked to chapter |
| `CronLock` | Interval + concurrency gate |

**Durability rule:** Pipeline may soft-delete or mark `failed`; it must not cascade-delete videos that still appear in JSON catalogue.

---

## 7. UX / product surfaces

| Surface | Must show |
|---------|-----------|
| `/learn` · `/learn/modules` | All published modules (API or fallback) |
| `/learn/modules/[slug]` | All parts/chapters with video + developed text |
| Immersive watch/read | Chapter youtube + transcript-derived copy |
| Admin module builder | Pipeline status, pending parts, number flags |
| Ops / cron health | Last success, interval `X`, skip/fail counts |

---

## 8. Delivery waves

### Wave A — Schedule + durability contract (this PRD’s first build slice)

1. [x] `YOUTUBE_PIPELINE_INTERVAL_HOURS` + `--respect-interval` on `run_youtube_content_pipeline`  
2. [x] Persist last-success timestamp; ops-visible via `data/youtube_pipeline_last_success.json`  
3. [x] Document cPanel cron with interval gate  
4. [x] Audit: Published BPS module has fallback Part 1–3 YouTube URLs  
5. [x] Tests: interval skip; zero-hours disables gate; Part 1…N mapping  

### Wave B — Content completeness

1. [ ] Auto-scaffold chapters for **all** series (not BPS-only) behind review flag  
2. [ ] Transcript retry queue with backoff  
3. [ ] Explicit `pending` part gaps in API for incomplete series  
4. [ ] Fallback regenerate command after successful map/publish  

### Wave C — Full catalogue + auto-publish

1. [ ] YouTube Data API full history merge  
2. [ ] Editor/LLM rewrite + human review queue UI  
3. [ ] Optional auto-publish with Level-1 provenance gate  
4. [ ] Embeddings / search over `TranscriptChunk` (backlog)

---

## 9. Acceptance criteria (paid ops DoD)

The engagement is **done** for a given content wave when:

1. **Cadence:** With cron installed, a successful pipeline run occurs at least once per calendar day **or** documents a valid `skipped: interval` when `X` hours have not elapsed.  
2. **Coverage:** Every video in `content_videos.json` / DB either has a transcript, a queued retry, or a recorded permanent failure reason.  
3. **Modules:** Every series with ≥1 video has a module stub; Part numbers map 1…N without inventing missing parts.  
4. **Learn Hub:** Killing or delaying the API still shows the fallback catalogue with module + chapter content (smoke test).  
5. **No invented numbers:** Stub/generated text carries provenance note; flagged numbers block auto-publish.  
6. **Idempotency:** Running the pipeline twice does not duplicate modules or chapters.  
7. **Evidence:** Ops log / admin panel shows last run status for stakeholder review.

---

## 10. How to run (ops)

```powershell
cd c:\BudgetNdioStory\bnske.budgetndiostory.org

# Daily-style run (respects X hours when flag lands)
python manage.py run_youtube_content_pipeline `
  --import-json `
  --transcript-limit 10 `
  --respect-interval

# Force run (ignore interval) for manual catch-up
python manage.py run_youtube_content_pipeline `
  --import-json `
  --transcript-limit 20 `
  --apply-map
```

Frontend smoke (never blank):

```powershell
cd c:\BudgetNdioStory\korosbns
# With API down / blocked: /learn/modules still renders from fallbacks
pnpm exec vitest run src/lib/__tests__/youtube-series.test.ts
```

Backend focused tests:

```powershell
cd c:\BudgetNdioStory\bnske.budgetndiostory.org
python -m pytest content/tests/test_youtube_content_pipeline.py content/tests/test_youtube_pipeline_services.py --no-cov -q
```

---

## 11. Out of scope (explicit)

- Inventing Treasury/Parliament figures from transcript guesses  
- Replacing Sanity/CMS (none — Django owns content)  
- Celery/Redis workers (cPanel cron + `CronLock` only)  
- TikTok pipeline (separate; same durability principles may apply later)

---

## 12. Traceability

| This PRD | Existing code |
|----------|---------------|
| RSS ingest | `youtube_sync_service.py`, `sync_youtube`, `sync_youtube_rss` |
| Transcripts | `transcript_service.py`, `youtube_transcript_client.py` |
| Part 1…N stubs | `youtube_content_pipeline.py`, `generate_youtube_module_stubs` |
| Map → civic | `youtube_civic_mapping_service.py` |
| Orchestration | `run_youtube_content_pipeline` |
| Always-present FE | `learn-hub.ts`, `fetch-policy.ts`, `data/fallbacks/civic-modules.json` |
| Prior PRD | `PRD-YOUTUBE-CONTENT-PIPELINE.md` (mechanics); **this doc owns durability + schedule** |

---

## 13. Decision log

| Date | Decision |
|------|----------|
| 2026-07-21 | Interval `X` hours default 24; cron may tick more often; command enforces gate |
| 2026-07-21 | Auto-apply map and auto-publish default **off** until Level-1 gate + ops trust |
| 2026-07-21 | “Always present” = Django rows + Next.js fallbacks for all Published modules |
| 2026-07-21 | Part N support beyond A/B/C is required (letter D+ / order 4+) |
