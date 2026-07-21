# PRD — YouTube → Transcript → Module Content Pipeline

**Doc id:** `PRD-YOUTUBE-CONTENT-PIPELINE-2026-07`  
**Version:** 1.0  
**Status:** Executable first-slice · Honest limits documented  
**Stack:** Django `bnske` (`content`) · Next.js `korosbns` (series grouping + learn hub)  
**Companions:** [`PRD-LMS-BUDGET-HUB.md`](./PRD-LMS-BUDGET-HUB.md) · [`PROGRESSIVE-UPGRADE.md`](./PROGRESSIVE-UPGRADE.md) · bnske `content/services/*`

---

## 1. Goal

Turn the Budget Ndio Story YouTube channel into structured learn-hub knowledge:

```
RSS ingest → transcript fetch → chunk/draft → series Parts A/B/C → civic module stubs → publish
```

No invented fiscal figures. Stubs quote or paraphrase transcript text only; numbers require Level-1 provenance before publish (see LMS PRD §7).

---

## 2. Inventory (as of this PRD)

| Layer | What exists | Gap |
|-------|-------------|-----|
| RSS → JSON | `sync_youtube_rss` merges Atom feed into `data/content_videos.json` (accumulates over time) | YouTube channel Atom returns **~15 newest** only; not a full historical catalogue |
| RSS → DB | `YouTubeSyncService.sync_from_rss` / `sync_youtube` | Was capped at **10**/run and double-sliced; import from JSON also truncated |
| Transcripts | `Transcript` / `TranscriptChunk` / `TranscriptService.upload` + `process_pending` | No auto-fetch from captions/third party |
| Knowledge | `KnowledgeEntry` drafts from chunks | No series/Part A–C structure |
| Frontend | `youtube-series.ts` groups PART 1/2/3; BPS URLs on civic module | No PART→A/B/C letter map; no draft generator |

**Honest “all videos” path:** RSS alone cannot pull the full channel history. Full catalogue needs either (a) long-running JSON merge + supplemental URL lists, or (b) YouTube Data API playlist pagination (`YOUTUBE_API_KEY`). First slice: raise RSS/DB caps to feed size, import full JSON store, document API path as Wave 2.

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

| Title signal | Module part |
|--------------|-------------|
| No PART / PART 1 | **A** |
| PART 2 | **B** |
| PART 3 | **C** |
| PART 4+ | Letter by index (`D`, …) or `PART_N` metadata — learn UI currently expects ≤3 for BPS |

Pipeline outputs one **series stub** with `parts.A|B|C` each holding `video_id`, `youtube_url`, `title`, and a **chapter stub** derived from transcript (headline + short bullets from text — no fabricated budget numbers).

---

## 5. First slice (this delivery)

1. Configurable RSS max (`YOUTUBE_RSS_MAX_ENTRIES`, default **15**); remove DB sync double-cap; **import full** JSON catalogue into DB.
2. `youtube_transcript_client` + `fetch_youtube_transcripts` management command → store on `Transcript`.
3. Pure pipeline: PART→A/B/C + series grouping + stub JSON writer (`generate_youtube_module_stubs`).
4. Frontend: `partLetterFromTitle` + tests; PRD + progressive-upgrade link.
5. Focused unit tests (no live network in CI).

**Deferred (Wave 2+):** YouTube Data API full history; LLM rewrite agent with human review queue; auto-publish to civic modules; embeddings / semantic search; MCP-only Cursor connector committed to team settings.

---

## 6. How to run

```powershell
# bnske — from repo root
cd c:\BudgetNdioStory\bnske.budgetndiostory.org

# 1) Pull newest RSS into JSON store (merge keeps older IDs)
python manage.py sync_youtube_rss --max 15

# 2) Sync JSON/DB (full import from store)
python manage.py sync_youtube --import-json
# or live RSS into DB:
python manage.py sync_youtube

# 3) Fetch transcripts (HTTP youtube-transcript.ai)
python manage.py fetch_youtube_transcripts --limit 5
# dry-run:
python manage.py fetch_youtube_transcripts --limit 5 --dry-run

# 4) Chunk → KnowledgeEntry drafts
python manage.py process_transcripts

# 5) Series Parts A/B/C stubs (admin-ready JSON under data/)
python manage.py generate_youtube_module_stubs --out data/youtube_module_stubs.json
```

Cursor MCP (optional): Settings → MCP → add `https://youtube-transcript.ai/mcp`, then ask the agent to call `get_youtube_transcript` for a URL. Prefer Django HTTP for batch jobs.

Frontend series tests:

```powershell
cd c:\BudgetNdioStory\korosbns
pnpm exec vitest run src/lib/__tests__/youtube-series.test.ts
```

---

## 7. Success criteria (first slice)

- [x] PRD exists and states RSS vs full-catalogue truth
- [x] DB sync can ingest ≥ feed size / full JSON store
- [x] Transcript fetch path without API key (HTTP client + command)
- [x] PART 1/2/3 → A/B/C mapping tested (TS + Python)
- [x] Stub generator writes JSON without inventing fiscal figures
- [ ] Full channel history via Data API (deferred)
- [ ] Auto-publish stubs into live civic modules (deferred)

---

## 8. Next steps — “limitless” knowledge extraction

1. **Catalogue completeness:** playlist / uploads playlist via Data API; merge into `content_videos.json`.
2. **Agent rewrite:** LLM drafts chapter copy from chunks → editor review → `ContentService` publish.
3. **Provenance gate:** any number in module text must cite Treasury/Parliament source ID.
4. **Embeddings:** index `TranscriptChunk` for search (backlog `010-search.md`).
5. **Learn hub:** map stub `parts` onto civic chapter steps + YouTube URLs (extend BPS pattern).
