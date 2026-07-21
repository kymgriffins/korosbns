import {
  adminCampaignsApi,
  adminSubscribersApi,
  adminInboxApi,
  adminOutboxApi,
  adminContactMessagesApi,
  adminEmailHooksApi,
} from "@/lib/admin-api";
import type {
  NewsletterCampaign,
  NewsletterSubscriber,
  NewsletterInboxMessage,
  NewsletterOutboxEmail,
  ContactMessage,
  EmailHook,
} from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type {
  NewsletterCampaign,
  NewsletterSubscriber,
  NewsletterInboxMessage,
  NewsletterOutboxEmail,
  ContactMessage,
  EmailHook,
};

let _campaigns: NewsletterCampaign[] = [];
let _subscribers: NewsletterSubscriber[] = [];
let _inboxMessages: NewsletterInboxMessage[] = [];
let _outboxEmails: NewsletterOutboxEmail[] = [];
let _contactMessages: ContactMessage[] = [];
let _emailHooks: EmailHook[] = [];

export const adminCommunicationData = {
  campaigns: {
    get: () => _campaigns,
    set: (items: NewsletterCampaign[]) => { _campaigns = items; },
    fetch: (params?: { page?: number; status?: string }) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.list(params).then((r) => {
          const results = r.results ?? [];
          _campaigns = results;
          return results;
        }),
        () => _campaigns,
      ),
    fetchById: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.get(id),
        () => _campaigns.find((c) => c.id === id) ?? null,
      ),
    create: (data: { subject: string; body_html?: string; body_plain?: string; audience_type?: string; scheduled_at?: string }) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.create(data),
        () => {
          const c: NewsletterCampaign = {
            id: `new-${Date.now()}`,
            subject: data.subject,
            body_html: data.body_html,
            body_plain: data.body_plain,
            status: "draft",
            status_display: "Draft",
            audience_type: data.audience_type ?? "all",
            audience_type_display: "All Subscribers",
            recipient_count: 0,
            sent_count: 0,
            failed_count: 0,
            scheduled_at: data.scheduled_at ?? null,
            sent_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          _campaigns.unshift(c);
          return c;
        },
      ),
    update: (id: string, data: { subject?: string; body_html?: string; body_plain?: string; audience_type?: string }) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.update(id, data),
        () => {
          const idx = _campaigns.findIndex((c) => c.id === id);
          if (idx !== -1) _campaigns[idx] = { ..._campaigns[idx], ...data };
          return _campaigns[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.delete(id).then(() => {
          _campaigns = _campaigns.filter((c) => c.id !== id);
        }),
        () => { _campaigns = _campaigns.filter((c) => c.id !== id); },
      ),
    send: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.send(id),
        () => null,
      ),
    schedule: (id: string, scheduledAt: string) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.schedule(id, scheduledAt),
        () => null,
      ),
    preview: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminCampaignsApi.preview(id),
        () => null,
      ),
  },
  subscribers: {
    get: () => _subscribers,
    set: (items: NewsletterSubscriber[]) => { _subscribers = items; },
    fetch: (params?: { page?: number; active_only?: boolean }) =>
      withFallback(
        "admin-communication",
        () => adminSubscribersApi.list(params).then((r) => {
          const results = r.results ?? [];
          _subscribers = results;
          return results;
        }),
        () => _subscribers,
      ),
  },
  inbox: {
    get: () => _inboxMessages,
    set: (items: NewsletterInboxMessage[]) => { _inboxMessages = items; },
    fetch: (params?: { page?: number; message_type?: string; is_read?: boolean }) =>
      withFallback(
        "admin-communication",
        () => adminInboxApi.list(params).then((r) => {
          const results = r.results ?? [];
          _inboxMessages = results;
          return results;
        }),
        () => _inboxMessages,
      ),
    fetchById: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminInboxApi.get(id),
        () => _inboxMessages.find((m) => m.id === id) ?? null,
      ),
    markRead: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminInboxApi.markRead(id),
        () => {
          const idx = _inboxMessages.findIndex((m) => m.id === id);
          if (idx !== -1) _inboxMessages[idx] = { ..._inboxMessages[idx], is_read: true };
          return _inboxMessages[idx] ?? null;
        },
      ),
    createNote: (data: { subject: string; body_plain: string }) =>
      withFallback(
        "admin-communication",
        () => adminInboxApi.createNote(data),
        () => null,
      ),
  },
  outbox: {
    get: () => _outboxEmails,
    set: (items: NewsletterOutboxEmail[]) => { _outboxEmails = items; },
    fetch: (params?: { page?: number; status?: string }) =>
      withFallback(
        "admin-communication",
        () => adminOutboxApi.list(params).then((r) => {
          const results = r.results ?? [];
          _outboxEmails = results;
          return results;
        }),
        () => _outboxEmails,
      ),
    dispatch: () =>
      withFallback(
        "admin-communication",
        () => adminOutboxApi.dispatch(),
        () => ({ processed: 0, sent: 0, failed: 0 }),
      ),
    retry: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminOutboxApi.retry(id),
        () => null,
      ),
  },
  contactMessages: {
    get: () => _contactMessages,
    set: (items: ContactMessage[]) => { _contactMessages = items; },
    fetch: (params?: { page?: number; status?: string; q?: string }) =>
      withFallback(
        "admin-communication",
        () => adminContactMessagesApi.list(params).then((r) => {
          const results = r.results ?? [];
          _contactMessages = results;
          return results;
        }),
        () => _contactMessages,
      ),
    fetchById: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminContactMessagesApi.get(id),
        () => _contactMessages.find((m) => m.id === id) ?? null,
      ),
    reply: (id: string, replyBody: string) =>
      withFallback(
        "admin-communication",
        () => adminContactMessagesApi.reply(id, replyBody),
        () => null,
      ),
    markRead: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminContactMessagesApi.markRead(id),
        () => null,
      ),
    delete: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminContactMessagesApi.delete(id).then(() => {
          _contactMessages = _contactMessages.filter((m) => m.id !== id);
        }),
        () => { _contactMessages = _contactMessages.filter((m) => m.id !== id); },
      ),
  },
  emailHooks: {
    get: () => _emailHooks,
    set: (items: EmailHook[]) => { _emailHooks = items; },
    fetch: (params?: { status?: string; source?: string; q?: string }) =>
      withFallback(
        "admin-communication",
        () => adminEmailHooksApi.list(params).then((r) => {
          const results = r.results ?? [];
          _emailHooks = results;
          return { results, counts: r.counts ?? {}, sources: r.sources ?? [] };
        }),
        () => ({ results: _emailHooks, counts: {} as Record<string, number>, sources: [] as string[] }),
      ),
    resend: (id: string) =>
      withFallback(
        "admin-communication",
        () => adminEmailHooksApi.resend(id),
        () => null,
      ),
  },
};
