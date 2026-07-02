import { apiFetch } from "@/lib/api-client";
import type { ContactMessage, EmailHook, NewsletterSubscriber, ChatMessage } from "@/types/communication";

export type ApiListResponse<T> = {
  count: number;
  results: T[];
};

export const communicationApi = {
  contacts: {
    list: (params?: { page?: number; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch<ContactMessage[]>(`/communication/contacts/${qs ? `?${qs}` : ""}`, { auth: true });
    },
    reply: (id: string, reply: string) =>
      apiFetch<ContactMessage>(`/communication/contacts/${id}/reply/`, {
        method: "POST", auth: true, body: JSON.stringify({ reply }),
      }),
    delete: (id: string) =>
      apiFetch<void>(`/communication/contacts/${id}/`, { method: "DELETE", auth: true }),
  },
  subscribers: {
    list: (params?: { page?: number; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch<ApiListResponse<NewsletterSubscriber>>(`/newsletter/subscribers/${qs ? `?${qs}` : ""}`, { auth: true });
    },
  },
  emailHooks: {
    list: (params?: { page?: number; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.status) q.set("status", params.status);
      const qs = q.toString();
      return apiFetch<EmailHook[]>(`/communication/email-hooks/${qs ? `?${qs}` : ""}`, { auth: true });
    },
  },
  chat: {
    send: (content: string, name: string, email: string) =>
      apiFetch<{ id: string }>("/contact/", {
        method: "POST",
        body: JSON.stringify({ name, email, message: content, source: "chatbot" }),
      }),
  },
};
