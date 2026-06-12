import { buildApiUrl } from "@/lib/api-url";
import { sendEmail } from "@/lib/services/email-sender";

const CLAIMED_BY = "nextjs-citizen-app";

export type EmailHook = {
  id: string;
  recipient: string;
  subject: string;
  body_html: string;
  body_text: string;
  from_email: string;
  source: string;
  metadata: Record<string, unknown>;
  status: string;
  created_at: string;
};

function getApiKey(): string | null {
  return process.env.EMAIL_HOOK_API_KEY || null;
}

function authHeaders(): Record<string, string> {
  const key = getApiKey();
  return key ? { "X-Email-Hook-Key": key } : {};
}

export async function fetchPendingHooks(limit = 10): Promise<EmailHook[]> {
  const resp = await fetch(
    buildApiUrl(`/api/v1/email-hooks/pending/?limit=${limit}`),
    { headers: { ...authHeaders() } },
  );
  if (!resp.ok) return [];
  return resp.json();
}

export async function claimHook(id: string): Promise<boolean> {
  const resp = await fetch(buildApiUrl(`/api/v1/email-hooks/${id}/claim/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ claimed_by: CLAIMED_BY }),
  });
  return resp.ok;
}

export async function markSent(id: string): Promise<boolean> {
  const resp = await fetch(buildApiUrl(`/api/v1/email-hooks/${id}/sent/`), {
    method: "POST",
    headers: { ...authHeaders() },
  });
  return resp.ok;
}

export async function markFailed(id: string, errorMessage?: string): Promise<boolean> {
  const resp = await fetch(buildApiUrl(`/api/v1/email-hooks/${id}/failed/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ error_message: errorMessage || "Unknown error" }),
  });
  return resp.ok;
}

export async function processHook(hook: EmailHook): Promise<void> {
  const claimed = await claimHook(hook.id);
  if (!claimed) return;

  try {
    await sendEmail({
      to: hook.recipient,
      subject: hook.subject,
      html: hook.body_html || undefined,
      text: hook.body_text,
      from: hook.from_email,
    });
    await markSent(hook.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await markFailed(hook.id, message);
  }
}

export async function pollAndProcess(): Promise<number> {
  const hooks = await fetchPendingHooks(10);
  for (const hook of hooks) {
    await processHook(hook);
  }
  return hooks.length;
}
