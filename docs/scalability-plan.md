# Scalability Plan — Budget Ndio Story

## 1. Current Architecture Overview

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | Vercel (serverless) |
| Backend API | Django 5 / DRF | Shared hosting (bnske.budgetndiostory.org) |
| Database | SQLite (default), PostgreSQL (optional) | Shared hosting / managed |
| Media | Cloudinary (images, videos) | Cloudinary CDN |
| Analytics | Vercel Analytics, Microsoft Clarity | SaaS |

## 2. Database Connection Pooling

**Current state:** SQLite — no connection pooling; single-writer lock under concurrent requests.

**Recommendation:** Migrate to **PostgreSQL + PgBouncer** (or **pgcat** for sharded setups). PgBouncer in transaction mode can handle thousands of concurrent connections with minimal overhead.

- SQLite max ~10–20 concurrent writes
- PostgreSQL + PgBouncer: 500–2000+ concurrent connections
- Target pool size: `min: 10, max: 100` per Django process

## 3. Vercel Serverless Function Limits (Pro Plan)

| Limit | Value | Implication |
|-------|-------|-------------|
| Execution timeout | 10 s (Pro: 60 s) | API calls to Django must complete quickly |
| Memory | 1024 MB | Bundle size, Recharts/GSAP must be lazy |
| Cold start | ~500–2000 ms | Use `edge` runtime where possible; avoid heavy deps on critical paths |
| Concurrent invocations | 1000 (Pro soft) | Per-function; may require request queueing |

**Mitigations:**
- Use Next.js `unstable_noStore` sparingly; prefer ISR for static pages
- Offload heavy Django queries to dedicated worker dynos
- Implement edge caching via Vercel Edge Config or Redis

## 4. Frontend Bundle Optimization

| Library | Current Estimate | Strategy |
|---------|-----------------|----------|
| Recharts | ~150 kB gzip | `next/dynamic` with `ssr: false` |
| GSAP | ~45 kB gzip | Dynamic import on scroll-driven animations |
| Motion (framer-motion) | ~60 kB gzip | Tree-shake via `motion/react` (already in use) |
| Tabler Icons | ~200 kB gzip | Only import used icons (already done) |

**Target:** < 200 kB initial JS (route-based code splitting).

## 5. CDN Strategy

| Asset Type | CDN | Cache TTL |
|------------|-----|-----------|
| Static images (Cloudinary) | Cloudinary CDN | 1 year immutable |
| Next.js static assets | Vercel Edge Network | 31 days immutable |
| Django media (PDFs, uploads) | Cloudinary (via django-cloudinary-storage) | 1 year |
| API responses | Vercel Edge + React Query client cache | Varies (SWR) |

## 6. Rate Limiting

**Django REST Framework throttling** (configured in DRF settings):

- Anonymous: 100 requests / hour
- Authenticated citizens: 1000 requests / hour
- Admin endpoints: 10000 requests / hour
- Survey submissions: 10 / min per IP

**Frontend fallback:** React Query retries with exponential backoff.

## 7. Caching Strategy

| Layer | Tool | Details |
|-------|------|---------|
| Client state | React Query | `staleTime: 5 min`, `gcTime: 30 min` |
| API responses | Django Redis cache (via `django-redis`) | `CACHE_MIDDLEWARE_SECONDS = 300` |
| Session storage | Redis (`SESSION_ENGINE = redis`) | Reduces DB load |
| Pages (static) | Next.js ISR | `revalidate = 3600` |
| Pages (dynamic) | Vercel Edge Cache | `Cache-Control: s-maxage=60` |

## 8. Max Concurrent Users Estimate

| Bottleneck | Limit | Concurrent Users |
|------------|-------|------------------|
| Vercel serverless concurrency | 1000 invocations | ~5000 (5:1 request ratio) |
| Django on shared hosting (uWSGI) | ~50 workers | ~500–1000 |
| SQLite (write contention) | ~10–20 writes/s | ~100–200 |
| PostgreSQL + PgBouncer | 500 connections | ~5000–10000 |
| Cloudinary CDN | Effectively unlimited | N/A |

**Estimated capacity with current SQLite:** ~200 concurrent users

**Estimated capacity with PostgreSQL + Redis + PgBouncer:** ~5000–10000 concurrent users

## 9. Recommendations for Scaling

| Priority | Action | Impact |
|----------|--------|--------|
| P0 | Migrate SQLite → PostgreSQL + PgBouncer | Removes primary bottleneck |
| P0 | Add Redis for caching + sessions | 10× reduction in DB reads |
| P1 | Use Cloudinary CDN for all media (already done) | Reduces server bandwidth |
| P1 | Implement DRF throttling (already done) | Prevents abuse |
| P2 | Add Celery + Redis for background tasks (email, PDF generation) | Keeps API responsive |
| P2 | Upgrade Vercel plan to Pro (if nearing concurrency limits) | Increases function timeout to 60 s |
| P3 | Move Django to dedicated VPS (DigitalOcean / Linode) | More worker processes, better I/O |
| P3 | Implement Redis-based rate limiting on Vercel Edge | Reduces Django load |
| P3 | Add request queueing for heavy operations | Smoothes traffic spikes |
