# Stories & viral gem clips — team sidenote

> **Status (ft-stories):** The **Stories** block on `/learn` is **hidden** with no public placeholder — citizens see articles/trivia/repository only. Team planning lives in this file, not in the UI. The **home page marquee** promotes **articles** (not stories) so links stay valid.

## Why we hid it

The current Stories row is an MVP shell (API + swipe cards). We are replacing it with a **transcript-first “viral gem moments”** experience: no GPU, no ffmpeg on cPanel, citizen-facing discovery on Budget Ndio Story.

## This plan fits our stack

| Constraint | How the plan addresses it |
|------------|---------------------------|
| 1GB RAM, no GPU | Text-only AI + YouTube captions — minimal compute |
| Django 5 backend | Async views for transcript fetch + httpx to AI |
| Next.js frontend | Timestamped YouTube embeds (`?start=`) — no video processing |
| cPanel hosting | No ffmpeg, no storage bloat, no heavy workers for MVP |
| BNS focus | Citizen content discovery, not admin tooling |

## Target architecture (summary)

1. **Backend** — `youtube-transcript-api` → raw snippets with `start` / `duration` → AI “gem detection” → store clips (title, summary, tags, `video_id`, `start`, `end`).
2. **Frontend** — `GemClipCard` with vertical-friendly layout, YouTube iframe `?start=` + optional autoplay (muted for browser policy).
3. **Deploy** — Django on bnske (cPanel); Next on Vercel; CORS/proxy as today.

### Django sketch

- Service: `TranscriptService.fetch_transcript_raw(video_id)` (wrap sync API with `sync_to_async`).
- View: `POST /api/videos/{video_id}/analyze-gems/` (async; ORM via `sync_to_async`).
- Cache transcripts 24h (`cache.set(yt_transcript:{id}, ...)`).

### Next.js sketch

- `GemClipCard`: embed URL `https://www.youtube.com/embed/{id}?start={floor(start)}&mute=1`.
- Swiper (or similar) for Shorts-like horizontal/vertical browse.
- JSON-LD `VideoObject` + `hasPart` clips for SEO.

## MVP rollout (2-week sprint reference)

### Week 1

- [ ] Django: transcript fetch + basic gem-detection prompt (Kenyan budget / policy context)
- [ ] API: `POST /api/videos/:id/analyze`
- [ ] Next: `GemClipCard` + timestamped embed
- [ ] Test with 3–5 public policy podcasts

### Week 2

- [ ] Loading / empty states (“Transcript not available” ~30% of videos)
- [ ] Swipe UX polish
- [ ] Basic analytics (clip plays)
- [ ] SEO structured data for clips

## MVP limitations (document for users)

1. YouTube branding on embeds (acceptable for v1).
2. No true vertical crop — CSS `aspect-[9/16]` + letterboxing.
3. Not all videos have captions — graceful fallback UI.
4. Transcript API rate limits — cache + backoff.

## Cost ballpark (monthly)

| Item | Est. |
|------|------|
| cPanel (existing) | $5–10 |
| Vercel Next | $0 (hobby) |
| OpenAI (≈500 videos × ~2K tokens) | $2–5 |
| **Total** | **~$7–15** |

## Where to find this later

- **Repo path:** `korosbns/docs/STORIES_ROADMAP.md` (this file)
- **Feature flag:** `src/constants/feature-flags.ts` (`LEARN_STORIES_VISIBLE`)
- **Branch:** `ft-stories`

## Enabling the old Stories section (dev only)

```bash
# .env.local
NEXT_PUBLIC_ENABLE_LEARN_STORIES=true
```

Redeploy / restart dev server. **Do not set this in Vercel production** until the new gem pipeline replaces it.

## Next immediate engineering steps

```bash
pip install youtube-transcript-api==1.2.4
python manage.py shell
# >>> from youtube_transcript_api import YouTubeTranscriptApi
# >>> YouTubeTranscriptApi().fetch("VIDEO_ID").to_raw_data()[:3]
```

Then: one gem-detection prompt tuned for **Kenyan budget / youth civic** language → one Next card on staging → IT review.

---

*Branch: `ft-stories` — hides Learn Stories UI; full implementation tracked here.*
