# BNS Architecture — Headless CMS Reference

## Overview

BNS uses a **headless CMS** architecture: Django REST Framework serves JSON APIs; a Next.js frontend consumes them through a typed data layer with offline-first fallbacks.

```
┌─────────────────────────────────────────────────────────┐
│  Next.js (korosbns)                                     │
│                                                         │
│  Page / Component                                       │
│       │                                                 │
│       ▼                                                 │
│  src/data/{domain}.ts  ←─── withFallback()              │
│       │                       │                         │
│       │                  ┌────┴────┐                     │
│       │                  │         │                     │
│       ▼                  ▼         ▼                     │
│  src/lib/{domain}-api.ts   Seed JSON / inline defaults  │
│       │                                                 │
│       ▼                                                 │
│  Next.js Rewrite Proxy                                  │
│  (/api/v1/* → backend)                                  │
│                                                         │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP (JSON)
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Django Backend (bnske.budgetndiostory.org)              │
│                                                         │
│  Django Admin (bnske/admin/) ←─── Staff Users           │
│       │                                                 │
│       ▼                                                 │
│  Django REST Framework (DRF) ViewSets                   │
│       │                                                 │
│       ▼                                                 │
│  PostgreSQL                                              │
└─────────────────────────────────────────────────────────┘
```

## Django Admin (Staff-Facing)

- **URL:** `bnske.budgetndiostory.org/admin/` (separate subdomain)
- Manages: users, content (articles/videos/modules), events, surveys, forum posts, gamification config, and system settings.
- All content originates here — staff editors create and publish through Django Admin.
- The frontend NEVER reads directly from Django Admin; it consumes the public REST API only.

## Next.js Frontend (Public + Admin)

### Data Layer (`src/data/*.ts`)

Every domain has a **store** at `src/data/{domain}.ts` following a consistent pattern:

```typescript
export const domainData = {
  items: {
    get: () => _items,                              // synchronous read
    set: (items) => { _items = items; },             // synchronous write
    fetch: () => withFallback("domain",              // async read from API or fallback
      () => api.list(),
      () => DEFAULT_ITEMS,
    ),
    fetchById: (id) => withFallback("domain",        // async single-item read
      () => api.get(id),
      () => null,
    ),
    create: (payload) => withFallback("domain",      // async create
      () => api.create(payload),
      () => localFallbackCreate(payload),
    ),
    update: (id, payload) => withFallback("domain",  // async update
      () => api.update(id, payload),
      () => localFallbackUpdate(id, payload),
    ),
    delete: (id) => withFallback("domain",           // async delete
      () => api.delete(id).then(() => true),
      () => { _items = _items.filter(i => i.id !== id); return true; },
    ),
  },
};
```

### withFallback() Adapter

**File:** `src/data/adapter.ts`

The `withFallback(domain, apiCall, fallback)` function:

1. Tries the `apiCall` first (real HTTP request to the Django backend)
2. If the API call succeeds, returns the data as-is
3. If the API call fails (network error, 500, etc.), calls `fallback()` and returns those defaults
4. Never throws — pages always render, even offline

This is the core architectural guarantee: **the UI never breaks when the backend is down**.

### API Clients (`src/lib/*-api.ts`)

Thin wrappers around `fetch()` that:
- Attach auth headers (`Authorization: Bearer bns_at`)
- Handle JSON serialization/deserialization
- Parse `ApiRequestError` from error responses
- Map response shapes to frontend types

### Seed Data

| Source | Purpose | Domains |
|--------|---------|---------|
| `src/constants/bnsConfig.json` | Organization config, leadership, consortium partners, meeting action items | Tasks, Users, Partners, Site Inventory |
| `src/constants/content_videos.example.json` | Demo video content | Videos |
| `src/constants/civic_modules.json` | Learning module structure | Learning |
| `src/constants/engagement_surveys.example.json` | Sample surveys | Surveys |
| `src/constants/content_events.example.json` | Demo events | Events |
| Inline defaults (in store files) | Zero-value fallback states | Gamification, Analytics, Forum |

### Shadcn UI Components

**File:** `src/components/ui/`

All UI components follow the shadcn `new-york` style with slate base colors. Component inventory:

| Component | Source | Status |
|-----------|--------|--------|
| button, input, label, textarea, select, checkbox, switch, badge, card, avatar, skeleton, tabs, table, separator, tooltip, progress | shadcn registry | Installed |
| dropdown-menu, dialog, sheet, sidebar, chart | shadcn registry | Installed |
| breadcrumb, popover, scroll-area, calendar, command | shadcn registry | Installed |

### Auth Model (Hybrid)

- **Anonymous browsing:** Most pages work without authentication (read-only)
- **Cookie-based auth:** `bns_at` (access token) and `bns_rt` (refresh token) as HttpOnly cookies
- **Token storage:** `sessionStorage` (access) + `localStorage` (refresh) + cookie bridge for middleware
- **Route protection:** `admin-guard.tsx` checks role membership via `ADMIN_ROLES` set in `src/constants/rbac.ts`
- **API auth:** Bearer token from `bns_at` cookie sent on `auth: true` requests

## Routing Architecture

```
/                              → Marketing landing page
/auth/login                   → Authentication
/auth/register                → Registration
/admin/dashboard/*            → Admin pages (40+ pages, guard-protected)
  /task                       → Task board
  /task/new                   → Create task
  /task/[id]                  → Task detail
  /task/report                → Weekly report
/task/*                       → Public task pages (no auth required)
/learn/*                      → Learning hub (untouched)
/api/v1/*                     → Proxy to Django backend
```

## Deployment

- **Frontend:** Vercel (korosbns)
- **Backend:** VPS hosted at bnske.budgetndiostory.org
- **API proxy:** Next.js rewrites in `next.config.ts` forward `/api/v1/*` to the Django backend
- **Database:** PostgreSQL on VPS
- **Media files:** Cloudinary for images, local storage for uploads

## Key Principles

1. **Offline-first UI:** Every page renders with or without a backend. `withFallback()` guarantees this.
2. **No direct Django Admin consumption:** Frontend uses the REST API exclusively.
3. **Data stores are the single source of truth:** Pages never call API functions directly.
4. **Seed JSONs are the demo/default source:** They let the frontend work standalone for development and demo.
5. **Admin is staff-only:** The `/admin/dashboard/*` routes require `isLoggedIn` + role check via `admin-guard.tsx`.
