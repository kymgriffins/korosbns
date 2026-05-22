# Vercel deployment — environment & registration troubleshooting

## Paste into Vercel (Production)

Use the file [`.env.vercel.production.example`](../.env.vercel.production.example) in the project root. Add each variable under **Settings → Environment Variables → Production**, then **Redeploy**.

| Variable | Value | Notes |
|----------|--------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://bnske.budgetndiostory.org` | **API only** — not `budgetndiostory.org` |
| `API_PROXY_TARGET` | `https://bnske.budgetndiostory.org` | Same as API base |
| `NEXT_PUBLIC_SITE_URL` | `https://budgetndiostory.org` | Your public Next.js domain |
| `NEXT_PUBLIC_DEFAULT_ORG_SLUG` | `bns-default` | Must exist in Django |
| `NEXT_PUBLIC_DEBUG_LOGS` | `false` | Set `true` briefly while debugging register |

## Backend (Django on bnske) must have

On the API server `.env.prod`:

```bash
FRONTEND_URL=https://budgetndiostory.org
CORS_ALLOWED_ORIGINS=https://budgetndiostory.org,https://www.budgetndiostory.org
```

If you test on a `*.vercel.app` preview URL, add that origin to `CORS_ALLOWED_ORIGINS` as well, or test only on the custom domain.

## How registration should work in the browser

1. Open `/auth/register/` on your citizen site.
2. DevTools → **Network** → submit the form.
3. You should see:

   `POST https://budgetndiostory.org/api/v1/auth/register/`  
   (same origin as the page — **not** a direct call to `bnske` unless API and site share the same host)

4. Expected status: **201** with JSON `Registration successful. Please verify your email.`

## If you still see 500

| Check | What to do |
|-------|------------|
| Wrong API env | `NEXT_PUBLIC_API_BASE_URL` must be `https://bnske.budgetndiostory.org`. If it equals `NEXT_PUBLIC_SITE_URL`, the app proxies to itself → 500. |
| Env not applied | After changing variables in Vercel, trigger a **new deployment** (not just refresh the page). |
| Response body | In Network tab, open the failed request → **Response**. JSON `detail` = Django. HTML = Vercel/Next error. |
| Email already used | API returns **400** with a clear message — try a new email. |
| SMTP failure | Django may return **500** if verification email cannot send — check API server email settings. |
| Password rules | Use 10+ characters; Django validators apply. |

## Quick API test (bypasses Next.js)

```bash
curl -X POST "https://bnske.budgetndiostory.org/api/v1/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"you+test@example.com\",\"password\":\"YourSecurePass123!\"}"
```

If this returns **201** but the website returns **500**, the problem is frontend env or proxy — fix env and redeploy.

## Proxy implementation

Browser calls `/api/v1/...` on the Next.js host. The App Router handler at `src/app/api/v1/[...path]/route.ts` forwards to BNSKE (more reliable than `next.config` rewrites alone for POST on Vercel).
