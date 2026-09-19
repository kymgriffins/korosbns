import { withFallback } from "@/data/adapter";
import { communicationApi } from "@/lib/communication/api";
import { citizenApi } from "@/lib/api-client";
import type { ContactMessage, EmailHook, NewsletterSubscriber } from "@/types/communication";

export const communicationData = {
  publicContact: {
    submit: (body: { name: string; email: string; message: string; source?: string }) =>
      citizenApi.submitContact(body),
  },
  contacts: {
    fetch: (params?: { page?: number; search?: string }) =>
      withFallback(
        "communication",
        () => communicationApi.contacts.list(params),
        () => [
          { id: "demo-c1", name: "Jane Mwangi", email: "jane@example.com", message: "Inquiry about county budget", status: "NEW" as const, source: "website", created_at: new Date().toISOString() },
          { id: "demo-c2", name: "Peter Kamau", email: "peter@example.com", message: "Question about town hall", status: "READ" as const, source: "chatbot", created_at: new Date().toISOString() },
        ] as ContactMessage[],
      ),
    reply: (id: string, reply: string) =>
      communicationApi.contacts.reply(id, reply),
    delete: (id: string) =>
      communicationApi.contacts.delete(id),
  },
  subscribers: {
    fetch: (params?: { page?: number; search?: string }) =>
      withFallback(
        "communication",
        () => communicationApi.subscribers.list(params),
        () => ({ count: 0, results: [] as NewsletterSubscriber[] }),
      ),
  },
  emailHooks: {
    fetch: (params?: { page?: number; status?: string }) =>
      withFallback(
        "communication",
        () => communicationApi.emailHooks.list(params),
        () => [] as EmailHook[],
      ),
  },
  chat: {
    send: (content: string, name: string, email: string) =>
      communicationApi.chat.send(content, name, email),
  },
};
