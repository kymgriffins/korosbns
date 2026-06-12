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
  const url = buildApiUrl(`/api/v1/email-hooks/pending/?limit=${limit}`);
  const resp = await fetch(url, { headers: { ...authHeaders() } });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.warn(`[EmailHookService] fetchPendingHooks ${resp.status} from ${url}: ${body.slice(0, 200)}`);
    return [];
  }
  return resp.json();
}

export async function claimHook(id: string): Promise<boolean> {
  const url = buildApiUrl(`/api/v1/email-hooks/${id}/claim/`);
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ claimed_by: CLAIMED_BY }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.warn(`[EmailHookService] claimHook ${id} ${resp.status}: ${body.slice(0, 200)}`);
  }
  return resp.ok;
}

export async function markSent(id: string): Promise<boolean> {
  const url = buildApiUrl(`/api/v1/email-hooks/${id}/sent/`);
  const resp = await fetch(url, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.warn(`[EmailHookService] markSent ${id} ${resp.status}: ${body.slice(0, 200)}`);
  }
  return resp.ok;
}

export async function markFailed(id: string, errorMessage?: string): Promise<boolean> {
  const url = buildApiUrl(`/api/v1/email-hooks/${id}/failed/`);
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ error_message: errorMessage || "Unknown error" }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.warn(`[EmailHookService] markFailed ${id} ${resp.status}: ${body.slice(0, 200)}`);
  }
  return resp.ok;
}

export async function processHook(hook: EmailHook): Promise<void> {
  console.log(`[EmailHookService] processing hook ${hook.id} -> ${hook.recipient}`);
  const claimed = await claimHook(hook.id);
  if (!claimed) {
    console.warn(`[EmailHookService] claim failed for ${hook.id}`); // ts-ignore-line
    return;
  }

  try {
    await sendEmail({
      to: hook.recipient,
      subject: hook.subject,
      html: hook.body_html || undefined,
      text: hook.body_text,
      from: hook.from_email,
    });
    await markSent(hook.id);
    console.log(`[EmailHookService] hook ${hook.id} sent OK`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await markFailed(hook.id, message);
    console.warn(`[EmailHookService] hook ${hook.id} failed: ${message}`);
  }
}

export async function pollAndProcess(): Promise<number> {
  console.log("[EmailHookService] pollAndProcess started");
  const hooks = await fetchPendingHooks(10);
  console.log(`[EmailHookService] pollAndProcess got ${hooks.length} pending hooks`);
  for (const hook of hooks) {
    await processHook(hook);
  }
  console.log(`[EmailHookService] pollAndProcess done, processed ${hooks.length} hooks`);
  return hooks.length;
}
