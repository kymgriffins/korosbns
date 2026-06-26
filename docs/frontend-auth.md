# Frontend authentication architecture

This document is the **single source of truth** for korosbns auth. AI agents and human contributors must follow it. Do not implement alternate patterns (global AuthGuard on `/learn`, duplicate route lists, unvalidated redirects, or inconsistent `auth: true` flags).

## Auth model: HYBRID (Clerk-style)

Inspired by Clerk’s session model: a validated server session for privileged actions, with public browsing for discovery content.

| Audience | Can access |
|----------|------------|
| **Anonymous** | `/learn`, modules, forum (read), public profiles, documents, videos |
| **Anonymous + local profile** | Onboarding via `AnonymousIdentityPicker`, progress in `localStorage` |
| **Authenticated** | Everything above + account settings, quests, progress sync, forum posts, gamification |

### What “logged in” means

```typescript
isLoggedIn = Boolean(user) && !isError  // from GET /users/me/
```

Token presence alone (`isAuthenticated()`) is **not** sufficient for guards or privileged UI.

## File map

| File | Role |
|------|------|
| `src/lib/auth-policy.ts` | Route lists, redirect sanitization — **import this, never copy paths** |
| `src/lib/auth-middleware.ts` | Pure `evaluateAuthMiddleware()` for edge + tests |
| `middleware.ts` | Next.js edge wrapper |
| `src/contexts/auth-context.tsx` | Session provider, login/logout |
| `src/lib/api-client.ts` | Cookie-based auth, `apiFetch`, credentials: include |
| `src/components/citizen/protected.tsx` | Client guard (validates session after middleware) |
| `src/components/citizen/guest-only.tsx` | Redirects logged-in users away from login/register |

## Route protection layers

### Layer 1 — Middleware (token presence)

Protected paths (from `LEARN_PROTECTED_PATH_PREFIXES`):

- `/learn/account/*`
- `/learn/quests/*`

Middleware checks the `bns_has_session` marker cookie. It does **not** validate JWT expiry (the Django backend handles that via the `bns_at` HttpOnly cookie).

Auth pages:

- `/auth/login`, `/auth/register` → redirect to `/learn` if token present
- `/auth/verify`, `/auth/reset` → **always accessible** (reset/verify with stale cookie)

### Layer 2 — Client `<Protected>` (session validation)

Applied in layouts only:

- `learn/account/layout.tsx` → `AccountProtectedGate`
- `learn/quests/layout.tsx` → `QuestsProtectedGate`

**Do not** wrap `/learn`, `/learn/forum`, or `/learn/profile` with `<Protected>`.

### Layer 3 — UI action gating

Components gate **actions** (post thread, change password) with `isLoggedIn`, not page access.

Example: `ForumView` allows reading threads anonymously; create/post requires login.

## Redirect safety

All post-login redirects must use:

```typescript
import { sanitizeRedirectPath, DEFAULT_POST_LOGIN_PATH } from "@/lib/auth-policy";

const safe = sanitizeRedirectPath(rawNext, DEFAULT_POST_LOGIN_PATH);
router.push(safe);
```

Blocks: absolute URLs, `//` protocol-relative paths, `javascript:`, encoded bypasses, `@`, `\`, null bytes.

## API authentication

`apiFetch(path, { auth: true })` sends requests with `credentials: 'include'` so the browser automatically attaches the `bns_at` HttpOnly cookie. On 401, it calls the refresh endpoint (which uses the `bns_rt` cookie) and retries once.

### Requires `auth: true`

- `/users/me/`, profile PATCH, password change, logout
- `/content/learn/profile/`, `/content/learn/progress/`
- `/content/civic-chapters/{id}/complete/`
- `/engagement/trivia/{id}/attempt/`
- Forum POST endpoints
- `/gamification/me/`, events, certificates, referrals, challenge submit

### Public (no auth)

- Content lists, civic modules, forum GET, leaderboard, badge catalog

## Token storage

| Token | Storage | Notes |
|-------|---------|-------|
| Access (`bns_at`) | HttpOnly cookie | Set by Django; not readable by JS; sent automatically by the browser |
| Refresh (`bns_rt`) | HttpOnly cookie | Set by Django; SameSite=Strict; path-restricted to `/api/v1/auth/token/refresh/` |
| Session marker (`bns_has_session`) | Non-HttpOnly cookie | Readable by JS and Next.js middleware for fast-path auth checks |

## Anonymous Learning Hub flow

1. User visits `/learn` without login
2. `LearnPathsHome` shows “Continue as Anonymous User”
3. Profile stored in `localStorage` (`bns_user_profile`)
4. On login, profile syncs to backend via `useUpdateProfile`

**Critical:** Do not re-add `AuthGuard` to `LearnHubLayout` — it breaks anonymous access.

## Consent

`dpa_consent_granted` defaults to **`false`** when missing from the API. Never default consent to `true`.

## Testing requirements

When changing auth policy, run and update:

```bash
pnpm test src/lib/__tests__/auth-policy.test.ts
pnpm test src/lib/__tests__/auth-middleware.test.ts
pnpm test src/lib/__tests__/learn-hub-auth.test.ts
pnpm test src/lib/__tests__/api-client.test.ts
pnpm test src/lib/__tests__/learn-data.test.ts
```

Tests must import route lists from `auth-policy.ts`, not duplicate them.

## Learning Hub data loading

Production content comes from the Django API. Client rules:

- Civic modules: `fetchCivicModulesWithRetry()` in `src/lib/learn-data.ts` (always sets `results ?? []`, retries transient failures)
- Do **not** gate module rendering on local onboarding profile when API modules exist — use `createGuestBrowseProfile()` for browse-only mode
- List tabs: always use `data.results ?? []` from learn hub API responses

## Change checklist

- [ ] Updated `auth-policy.ts` if routes changed
- [ ] Updated `middleware.ts` / layouts / guards consistently
- [ ] Added `auth: true` to new privileged API calls
- [ ] Used `sanitizeRedirectPath` for all redirects
- [ ] Updated tests
- [ ] Updated this doc and `.cursor/rules/frontend-auth.mdc`
