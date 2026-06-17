# Frontend authentication (korosbns)

**Canonical policy module:** `src/lib/auth-policy.ts`  
**Full documentation:** `docs/frontend-auth.md`  
**Cursor rule:** `.cursor/rules/frontend-auth.mdc`

## Non-negotiable rules for AI agents

1. **Do not invent a new auth model.** The Learning Hub uses the **HYBRID** model defined in `auth-policy.ts`.
2. **Do not add a global login wall on `/learn/*`.** Only `/learn/account/*` and `/learn/quests/*` require authentication at the route level.
3. **Do not duplicate route lists.** Import `LEARN_PROTECTED_PATH_PREFIXES`, `AUTH_*` constants from `auth-policy.ts` for middleware, guards, and tests.
4. **Do not pass raw `next` query params to `router.push`.** Always use `sanitizeRedirectPath()`.
5. **Do not call privileged APIs without `auth: true`.** Progress, gamification, profile, chapter completion, trivia attempts, and forum writes require Bearer tokens.
6. **Use `isLoggedIn` from `useAuth()` for UI gating**, not `isAuthenticated()` (token presence without validation).

## Quick reference

| Concern | Implementation |
|---------|----------------|
| Session state | `AuthProvider` + `GET /users/me/` |
| Route protection (server) | `middleware.ts` → `evaluateAuthMiddleware()` |
| Route protection (client) | `<Protected>` on account/quests layouts only |
| Post-login redirect | `sanitizeRedirectPath()` |
| Token storage | `sessionStorage` (access) + `localStorage` (refresh) + cookie bridge for middleware |

When changing auth behavior, update **all** of: `auth-policy.ts`, `docs/frontend-auth.md`, tests in `src/lib/__tests__/auth-*.test.ts`, and `.cursor/rules/frontend-auth.mdc`.
