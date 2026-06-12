# Email Hook API — Frontend Integration Guide

## Overview

The backend can no longer send emails directly (SMTP blocked on the shared host).
Instead, every outgoing email is stored as a **hook record** in the database.
**Your frontend** polls these hooks, sends the email through your working mechanism
(EmailJS, browser fetch, etc.), then reports back success or failure.

This covers **all** email types:

| Email Type | Triggered By | Recipient |
|---|---|---|
| Email verification | User registers | The registering user |
| Password reset | User requests reset | The requesting user |
| Welcome email | Newsletter subscribe | The subscriber |
| Admin alert (contact form) | User submits contact | Staff inbox |
| Organization invitation | Admin invites user | The invitee |
| Onboarding notifications | Admin sets up simulation | Citizens & staff |
| Engagement notifications | Events, content published | Org members |
| Campaign newsletters | Admin sends campaign | Subscribers |
| Developer reports | Cron jobs | griffinskimutai\@gmail.com |

**One poller** (your Next.js citizen app) handles **all** destinations —
every recipient, including staff, gets their email from a single queue.

---

## How It Works

```
User action → Backend API → send_mail() → EmailHookBackend → creates EmailHook record in DB
                                                                      │
                                                                      ▼
Your frontend polls  ─── GET /api/v1/email-hooks/pending/
      │
      ▼
Claims a hook ─── POST /api/v1/email-hooks/<id>/claim/
      │
      ▼
Sends the email (your mechanism — EmailJS, fetch, etc.)
      │
      ├── Success → POST /api/v1/email-hooks/<id>/sent/
      └── Failure → POST /api/v1/email-hooks/<id>/failed/
```

---

## Auth

If `EMAIL_HOOK_API_KEY` is set on the backend, include it in every request:

```
X-Email-Hook-Key: your-api-key-here
```

If not set, endpoints are open. Ask the team which environment uses what.

---

## Endpoints

### 1. List Pending Hooks

FIFO order — oldest hooks first.

```
GET /api/v1/email-hooks/pending/?limit=20
```

**Query params:**

| Param | Default | Max | Description |
|---|---|---|---|
| `limit` | 20 | 20 | Number of hooks to fetch |

**Response `200`:**

```json
[
  {
    "id": "1a5a36b0-4a00-445e-a359-0a282d88a97c",
    "recipient": "user@example.com",
    "subject": "Verify your email",
    "body_html": "<h1>Welcome!</h1><p>Click <a href='...'>here</a> to verify.</p>",
    "body_text": "Welcome! Click here to verify: https://...",
    "from_email": "Budget Ndio Story <noreply@budgetndiostory.org>",
    "source": "",
    "metadata": {},
    "status": "pending",
    "created_at": "2026-06-12T07:45:00Z"
  }
]
```

> **Important:** Some emails only have `body_text` (no HTML). Some have both.
> Render `body_html` if present, fall back to `body_text`.

---

### 2. Claim a Hook

Claiming prevents other pollers (or a retry) from picking up the same hook.
Uses a database row-level lock — safe for concurrent claims.

```
POST /api/v1/email-hooks/<id>/claim/
```

**Request body:**

```json
{
  "claimed_by": "nextjs-citizen-app"
}
```

The `claimed_by` value identifies your app (useful for debugging).
Use a consistent string like `"nextjs-citizen-app"`.

**Response `200`:**

```json
{
  "status": "claimed",
  "id": "1a5a36b0-4a00-445e-a359-0a282d88a97c"
}
```

**Errors:**

| Code | Meaning | Action |
|---|---|---|
| `400` | Missing `claimed_by` | Send the field |
| `404` | Hook ID not found | Skip |
| `409` | Already claimed or sent | Skip (another poller got it) |

---

### 3. Mark as Sent

Call this **after** your frontend successfully delivers the email.

```
POST /api/v1/email-hooks/<id>/sent/
```

**Request body:** (empty)

**Response `200`:**

```json
{
  "status": "sent",
  "id": "1a5a36b0-4a00-445e-a359-0a282d88a97c"
}
```

**Errors:**

| Code | Meaning | Action |
|---|---|---|
| `400` | Hook not yet claimed | Claim it first |
| `404` | Hook ID not found | Skip |

---

### 4. Mark as Failed

Call this when your frontend **cannot** deliver the email.

```
POST /api/v1/email-hooks/<id>/failed/
```

**Request body:**

```json
{
  "error_message": "EmailJS returned 500"
}
```

`error_message` is optional but encouraged for debugging.

**Response `200`:**

```json
{
  "status": "failed",
  "id": "1a5a36b0-4a00-445e-a359-0a282d88a97c"
}
```

**Errors:**

| Code | Meaning | Action |
|---|---|---|
| `404` | Hook ID not found | Skip |

---

### 5. Queue Status (optional)

For dashboards or monitoring.

```
GET /api/v1/email-hooks/status/
```

**Response `200`:**

```json
{
  "pending": 12,
  "claimed": 3,
  "sent": 1042,
  "failed": 2,
  "total": 1059
}
```

---

## Implementation Guide for Next.js

### Polling Loop (recommended)

```javascript
const POLL_INTERVAL_MS = 2000; // 2 seconds
const CLAIMED_BY = 'nextjs-citizen-app';

async function pollHooks() {
  try {
    const resp = await fetch(
      'https://bnske.budgetndiostory.org/api/v1/email-hooks/pending/?limit=10',
      { headers: { 'X-Email-Hook-Key': process.env.EMAIL_HOOK_API_KEY } }
    );
    const hooks = await resp.json();

    for (const hook of hooks) {
      await processHook(hook);
    }
  } catch (err) {
    console.error('Email hook poll failed:', err);
  }
}

async function processHook(hook) {
  // 1. Claim
  const claimResp = await fetch(
    `https://bnske.budgetndiostory.org/api/v1/email-hooks/${hook.id}/claim/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Email-Hook-Key': process.env.EMAIL_HOOK_API_KEY },
      body: JSON.stringify({ claimed_by: CLAIMED_BY }),
    }
  );
  if (!claimResp.ok) return; // someone else claimed it

  try {
    // 2. Send via your mechanism (EmailJS, Resend, fetch, etc.)
    await sendEmail({
      to: hook.recipient,
      subject: hook.subject,
      html: hook.body_html || undefined,
      text: hook.body_text,
      from: hook.from_email,
    });

    // 3. Mark sent
    await fetch(
      `https://bnske.budgetndiostory.org/api/v1/email-hooks/${hook.id}/sent/`,
      { method: 'POST', headers: { 'X-Email-Hook-Key': process.env.EMAIL_HOOK_API_KEY } }
    );
  } catch (err) {
    // 4. Mark failed
    await fetch(
      `https://bnske.budgetndiostory.org/api/v1/email-hooks/${hook.id}/failed/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Email-Hook-Key': process.env.EMAIL_HOOK_API_KEY },
        body: JSON.stringify({ error_message: err.message }),
      }
    );
  }
}

// Start polling
setInterval(pollHooks, POLL_INTERVAL_MS);
pollHooks(); // immediate first poll
```

### Near-0 Lag (Optional)

If the backend has `FRONTEND_EMAIL_WEBHOOK` configured, the backend fires a POST to
that URL whenever new hooks are created. Expose an endpoint on your frontend like:

```
POST https://budgetndiostory.org/api/email-hooks/notify
```

Have it trigger an immediate `pollHooks()` instead of waiting for the next interval.

```javascript
// pages/api/email-hooks/notify.js (or App Router equivalent)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // Trigger an immediate poll (in production, use a queue/task system)
  await pollHooks();
  res.status(200).json({ ok: true });
}
```

---

## Webhook Receiver (if configured)

When `FRONTEND_EMAIL_WEBHOOK` is set on the backend, it sends:

```json
{
  "hook_ids": ["1a5a36b0-...", "2b6b47c1-..."],
  "count": 2
}
```

Your receiver should respond quickly (200, no body needed) and trigger a poll.

---

## Django Admin Monitoring

Staff can monitor the queue at `/admin/core/emailhook/`:

- **Filters**: status, source
- **Search**: recipient, subject
- **Actions**: reset hooks to pending for retry
- **Read-only**: no creation or editing from admin

---

## FAQ

**Q: What if no poller is running?**
The hooks stay `pending` indefinitely. They'll be picked up when the frontend starts polling. No data loss.

**Q: Can the same hook be claimed twice?**
No. Claim uses a database row-level lock (`SELECT ... FOR UPDATE`). The second claimer gets `409 Conflict`.

**Q: What email mechanism should I use from the frontend?**
Whatever already works — EmailJS, Resend SDK, a cloud function, or even a server-side API route that uses nodemailer. The backend doesn't care.

**Q: How do I test locally?**
Use `python manage.py test_email_hook your@email.com` on the backend to create a real hook, then poll from your frontend to see it flow through.

**Q: Will the backend ever send emails directly again?**
Yes — when the project moves to a VPS where SMTP ports aren't blocked. The SMTP code is preserved and dormant. Your polling code can remain as a fallback or be removed.
