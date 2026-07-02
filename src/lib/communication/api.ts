import type { ContactMessage, EmailHook, NewsletterSubscriber } from "@/types/communication";

export type ApiListResponse<T> = {
  count: number;
  results: T[];
};

function localFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers as Record<string, string>),
    },
  }).then(async (r) => {
    if (!r.ok) throw new Error(`Request failed (${r.status})`);
    if (r.status === 204) return {} as T;
    return r.json() as Promise<T>;
  });
}

export const communicationApi = {
  contacts: {
    list: (params?: { page?: number; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return localFetch<ContactMessage[]>(`/api/communication/contacts/${qs ? `?${qs}` : ""}`);
    },
    reply: (id: string, reply: string) =>
      localFetch<ContactMessage>(`/api/communication/contacts/${id}/reply/`, {
        method: "POST", body: JSON.stringify({ reply }),
      }),
    delete: (id: string) =>
      localFetch<void>(`/api/communication/contacts/${id}/`, { method: "DELETE" }),
  },
  subscribers: {
    list: (params?: { page?: number; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return localFetch<ApiListResponse<NewsletterSubscriber>>(`/api/communication/contacts/subscribers/${qs ? `?${qs}` : ""}`);
    },
  },
  emailHooks: {
    list: (params?: { page?: number; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.status) q.set("status", params.status);
      const qs = q.toString();
      return localFetch<EmailHook[]>(`/api/communication/email-hooks/${qs ? `?${qs}` : ""}`);
    },
  },
  chat: {
    send: (content: string, name: string, email: string) =>
      fetch("/api/v1/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message: content, source: "chatbot" }),
      }).then((r) => r.json() as Promise<{ id: string }>),
  },
};
