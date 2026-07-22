# PRD — YouTube → Transcript → Module Content Pipeline

**Doc id:** `PRD-YOUTUBE-CONTENT-PIPELINE-2026-07`  
**Version:** 1.1  
**Status:** Wave 1 done · Wave 2 in progress  
**Stack:** Django `bnske` (`content`) · Next.js `korosbns` (series grouping + learn hub)  
**Companions:** [`PRD-LMS-BUDGET-HUB.md`](./PRD-LMS-BUDGET-HUB.md) · [`PRD-RSS-LEARNING-CONTENT-ALWAYS-PRESENT.md`](./PRD-RSS-LEARNING-CONTENT-ALWAYS-PRESENT.md) (schedule + always-present durability) · [`PROGRESSIVE-UPGRADE.md`](./PROGRESSIVE-UPGRADE.md) · bnske `content/services/*`

---

## 1. Goal

Turn the Budget Ndio Story YouTube channel into structured learn-hub knowledge:

```
RSS ingest → transcript fetch → chunk/draft → series Parts A/B/C → civic module stubs → map to chapters → publish
```

No invented fiscal figures. Stubs quote or paraphrase transcript text only; numbers require Level-1 provenance before publish (see LMS PRD §7).

---

## 2. Inventory (as of this PRD)

| Layer | What exists | Gap |
|-------|-------------|-----|
| RSS → JSON | `sync_youtube_rss` merges Atom feed into `data/content_videos.json` (accumulates over time) | YouTube channel Atom returns **~15 newest** only; not a full historical catalogue |
| RSS → DB | `YouTubeSyncService.sync_from_rss` / `sync_youtube` | Caps raised to feed size; JSON import loads full store |
| Transcripts | `fetch_youtube_transcripts` via youtube-transcript.ai HTTP | Fair-use batching; no Data API captions |
| Knowledge | `process_transcripts` → `KnowledgeEntry` drafts | No auto-publish |
| Stubs | `generate_youtube_module_stubs` → Parts A/B/C JSON | — |
| Map | `map_youtube_stubs_to_modules` (dry-run default; `--apply` for URLs) | Published article bodies protected unless `--overwrite-published` |
| Drafts | `scaffold_youtube_chapter_drafts` with `numbers_flagged` | Human review queue (no LLM rewrite agent yet) |
| Orchestration | `run_youtube_content_pipeline` | Cron spacing / Data API still deferred |
| Frontend | `partLetterFromTitle` + BPS URL ensure | Live stub→API wiring optional |

**Honest “all videos” path:** RSS alone cannot pull the full channel history. Full catalogue needs either (a) long-running JSON merge + supplemental URL lists, or (b) YouTube Data API playlist pagination (`YOUTUBE_API_KEY`).

---

## 3. Transcript source (free, no API key)

| Path | Use |
|------|-----|
| HTTP | `GET https://youtube-transcript.ai/transcript/{VIDEO_ID}.txt` (+ optional `?lang=en`) — same engine as the product |
| MCP (Cursor/Claude) | Connector URL `https://youtube-transcript.ai/mcp` · tool `get_youtube_transcript` · param `video` | Optional for interactive agent sessions; **not required** for cron |

Django uses the HTTP client in production/cron. MCP is documented for local Cursor agents; do not block pipeline on MCP auth.

Fair-use rate limits apply — batch with `--limit` and cron spacing.

---

## 4. Module categorization (Parts A / B / C)

Series titles like `PART 2: County Budget: …` collapse via existing `normalizeSeriesTitle`.

| Title signal | Module part | Civic chapter order |
|--------------|-------------|---------------------|
| No PART / PART 1 | **A** | 1 |
| PART 2 | **B** | 2 |
| PART 3 | **C** | 3 |
| PART 4+ | Letter by index (`D`, …) | 4+ |

BPS series (`is_bps` / `budget-policy-statement`): Part A/B/C map to chapter orders 1/2/3; chapter 1 also receives the ordered A→C URL list (matches korosbns `BPS_YOUTUBE_URLS`).

Pipeline outputs one **series stub** with `parts.A|B|C` each holding `video_id`, `youtube_url`, `title`, and a **chapter stub** derived from transcript (headline + short bullets from text — no fabricated budget numbers).

---

## 5. Delivery waves

### Wave 1 — done

1. Configurable RSS max (`YOUTUBE_RSS_MAX_ENTRIES`, default **15**); remove DB sync double-cap; **import full** JSON catalogue into DB.
2. `youtube_transcript_client` + `fetch_youtube_transcripts` → store on `Transcript`.
3. Pure pipeline: PART→A/B/C + series grouping + stub JSON writer (`generate_youtube_module_stubs`).
4. Frontend: `partLetterFromTitle` + tests; PRD + progressive-upgrade link.
5. Focused unit tests (no live network in CI).

### Wave 2 — in progress

1. [x] `map_youtube_stubs_to_modules` + `YouTubeModuleMapService` — attach YouTube URLs to civic chapters; dry-run review JSON; `--apply` to write URLs.
2. [x] `run_youtube_content_pipeline` — sync → transcripts → process → stubs → drafts → map (map dry-run unless `--apply-map`).
3. [x] `scaffold_youtube_chapter_drafts` — reviewable chapter JSON with provenance + `numbers_flagged`.
4. [ ] Editor/LLM rewrite agent with human review queue UI.
5. [ ] Auto-publish stubs into live civic modules after Level-1 gate.
6. [ ] Full channel history via YouTube Data API.

**Published safety:** `--apply` updates `youtube_url` / `youtube_urls` only. Article bodies: draft ContentUnits via `--apply-article-drafts`; published bodies unchanged unless `--overwrite-published`.

---

## 6. How to run

```powershell
# bnske — from repo root
cd c:\BudgetNdioStory\bnske.budgetndiostory.org

# One-shot (map stays dry-run unless --apply-map)
python manage.py run_youtube_content_pipeline --import-json --transcript-limit 5

# Or step-by-step:
python manage.py sync_youtube_rss --max 15
python manage.py sync_youtube --import-json
python manage.py fetch_youtube_transcripts --limit 5
python manage.py process_transcripts
python manage.py generate_youtube_module_stubs --out data/youtube_module_stubs.json
python manage.py scaffold_youtube_chapter_drafts --stubs data/youtube_module_stubs.json
python manage.py map_youtube_stubs_to_modules --stubs data/youtube_module_stubs.json --bps-only
# After review:
python manage.py map_youtube_stubs_to_modules --stubs data/youtube_module_stubs.json --bps-only --apply
```

Cursor MCP (optional): Settings → MCP → add `https://youtube-transcript.ai/mcp`. Prefer Django HTTP for batch jobs.

Frontend series tests:

```powershell
cd c:\BudgetNdioStory\korosbns
pnpm exec vitest run src/lib/__tests__/youtube-series.test.ts
```

Focused bnske tests:

```powershell
cd c:\BudgetNdioStory\bnske.budgetndiostory.org
python -m pytest content/tests/test_youtube_content_pipeline.py content/tests/test_youtube_pipeline_services.py content/tests/test_youtube_module_mapping.py --no-cov -q
```

---

## 7. Success criteria

### Wave 1

- [x] PRD exists and states RSS vs full-catalogue truth
- [x] DB sync can ingest ≥ feed size / full JSON store
- [x] Transcript fetch path without API key (HTTP client + command)
- [x] PART 1/2/3 → A/B/C mapping tested (TS + Python)
- [x] Stub generator writes JSON without inventing fiscal figures

### Wave 2

- [x] Map stubs → civic chapter YouTube URLs (BPS A/B/C → orders 1/2/3)
- [x] Dry-run review JSON; `--apply` required to mutate chapters
- [x] Scaffold chapter drafts with provenance + number flags
- [x] One-shot orchestration command
- [ ] Full channel history via Data API (deferred)
- [ ] Auto-publish / LLM rewrite agent with review queue UI (deferred)

---

## 8. Next steps — “limitless” knowledge extraction

1. **Catalogue completeness:** playlist / uploads playlist via Data API; merge into `content_videos.json`.
2. **Agent rewrite:** LLM drafts chapter copy from chunks → editor review → `ContentService` publish.
3. **Provenance gate:** any number in module text must cite Treasury/Parliament source ID.
4. **Embeddings:** index `TranscriptChunk` for search (backlog `010-search.md`).
5. **Learn hub:** surface mapped chapter YouTube URLs from API (BPS ensure already client-side).
