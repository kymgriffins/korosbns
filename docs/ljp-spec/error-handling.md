# Error Handling
## Learning Journey Platform — Failure philosophy

**Principle:** Learning flow never punishes the learner for system failures. Recover gracefully; preserve progress; one clear retry path.

Cross-reference: `state-machines.md`, `domain-model.md` DM-12.

---

## 1. Error categories

| Category | Learner message tone | Retry | Lose progress? |
|----------|---------------------|-------|----------------|
| **Recoverable** | Calm, specific | Yes | No |
| **Partial** | Honest | Yes | No (use cache) |
| **Fatal (404)** | Neutral | Navigate away | N/A |
| **Auth** | Redirect | Login | Preserved after login |

---

## 2. Scenario playbook

### Video fails to load

| Field | Response |
|-------|----------|
| UI | Inline error on player + "Retry" button |
| State | Video machine → `error` |
| Progress | Parts already watched stay watched |
| Event | `VideoPartError` (optional v2) |
| Fallback | Show transcript expanded |

### Video buffering timeout

| Field | Response |
|-------|----------|
| UI | "Slow connection" + retry |
| After 3 fails | Offer transcript-only continue (decision log if implemented) |

### Trivia render error

| Field | Response |
|-------|----------|
| UI | Sheet error state — cannot skip |
| Action | Retry load; contact support link if persistent |
| **Never** | Close sheet without answer |

### Progress save fails (API phase)

| Field | Response |
|-------|----------|
| UI | Toast: "Couldn't save — trying again" |
| Action | Retry 3x exponential backoff |
| Cache | `sessionStorage` until sync succeeds |
| **Never** | Tell learner they lost work |

### API timeout (catalog)

| Field | Response |
|-------|----------|
| UI | Stale static catalog if available |
| Else | Full page error + retry |
| Hub | Degraded mode without progress |

### Offline

| Field | Response |
|-------|----------|
| v1 | Static catalog works; video needs network — clear message |
| v2 | Queue events + progress for sync |
| UI | Banner: "You're offline" |

### User refreshes mid-lesson

| Field | Response |
|-------|----------|
| Action | Restore `LessonSession` from `sessionStorage` |
| Video | Resume part index, not necessarily timestamp (v1) |
| Trivia | Re-ask if not in storage as answered |
| **Invariant** | DM-12 — completed parts stay complete |

### Unknown course / lesson slug

| Field | Response |
|-------|----------|
| UI | Next.js `notFound()` |
| Tone | Standard 404 — no stack traces |

### Auth expired mid-session

| Field | Response |
|-------|----------|
| Action | Redirect login with `next=` return URL |
| Progress | Session storage preserved |
| After login | Return to same lesson |

---

## 3. UI patterns

| Pattern | Use |
|---------|-----|
| Inline retry | Video, trivia |
| Toast (Sonner) | Save failures, background sync |
| Full page | Catalog total failure |
| `notFound()` | Invalid slugs |
| Error boundary | Unexpected React errors — generic + reload |

**Forbidden:**

```
❌ alert()
❌ Raw error.message to learner
❌ Infinite retry loops
❌ Dismiss error without action
❌ Reset lesson progress on error
```

---

## 4. Error boundary placement

```
app/(marketing)/learn/layout.tsx
  └── LmsProviders
        └── LmsErrorBoundary (client) — learn routes only
              └── LmsShell
                    └── pages
```

Boundary shows: "Something went wrong" + Reload + link to Home.

---

## 5. Logging

| Environment | Behavior |
|-------------|----------|
| Development | `console.error` with context |
| Production | Sentry (existing app integration) |
| Events | Failed saves logged as `ProgressSyncFailed` v2 |

---

## 6. Testing

| Scenario | Test type |
|----------|-----------|
| Video error | Integration — retry button |
| 404 slug | E2E |
| Refresh restore | Integration — sessionStorage |
| Trivia no skip on error | Integration |

---

## 7. Decision defaults

When spec silent:

1. **Preserve learner progress**
2. **One primary recovery action**
3. **No blame language**
4. **Fail closed on trivia integrity** (can't bypass checkpoint due to error)

Escalate new scenarios via `decision-log.md`.
