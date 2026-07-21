import { adminStudioApi } from "@/lib/admin-api";
import type { AdminStudioService, AdminStudioPortfolio, AdminStudioTestimonial, AdminStudioBooking } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminStudioService, AdminStudioPortfolio, AdminStudioTestimonial, AdminStudioBooking };

let _services: AdminStudioService[] = [];
let _portfolio: AdminStudioPortfolio[] = [];
let _testimonials: AdminStudioTestimonial[] = [];
let _bookings: AdminStudioBooking[] = [];

export const adminStudioData = {
  services: {
    get: () => _services,
    set: (items: AdminStudioService[]) => { _services = items; },
    fetch: () =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.listServices().then((r) => {
          const results = r.results ?? [];
          _services = results;
          return results;
        }),
        () => _services,
      ),
    create: (data: { title: string; description?: string; price?: string; icon?: string; is_published?: boolean }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.createService(data),
        () => {
          const s: AdminStudioService = {
            id: `new-${Date.now()}`,
            title: data.title,
            description: data.description ?? "",
            icon: data.icon ?? "code",
            price: data.price ?? "0",
            order: _services.length,
            is_published: data.is_published ?? false,
          };
          _services.unshift(s);
          return s;
        },
      ),
    update: (id: string, data: { title?: string; description?: string; price?: string; icon?: string; is_published?: boolean; order?: number }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.updateService(id, data),
        () => {
          const idx = _services.findIndex((s) => s.id === id);
          if (idx !== -1) _services[idx] = { ..._services[idx], ...data };
          return _services[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.deleteService(id).then(() => {
          _services = _services.filter((s) => s.id !== id);
        }),
        () => { _services = _services.filter((s) => s.id !== id); },
      ),
  },
  portfolio: {
    get: () => _portfolio,
    set: (items: AdminStudioPortfolio[]) => { _portfolio = items; },
    fetch: () =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.listPortfolio().then((r) => {
          const results = r.results ?? [];
          _portfolio = results;
          return results;
        }),
        () => _portfolio,
      ),
    create: (data: { title: string; description?: string; media_type?: string; category?: string; is_published?: boolean }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.createPortfolio(data),
        () => {
          const p: AdminStudioPortfolio = {
            id: `new-${Date.now()}`,
            title: data.title,
            description: data.description ?? "",
            media_type: data.media_type ?? "image",
            image_url: "",
            video_url: "",
            video_platform: "",
            category: data.category ?? "",
            order: _portfolio.length,
            is_published: data.is_published ?? false,
          };
          _portfolio.unshift(p);
          return p;
        },
      ),
    update: (id: string, data: { title?: string; description?: string; media_type?: string; image_url?: string; category?: string; is_published?: boolean; order?: number }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.updatePortfolio(id, data),
        () => {
          const idx = _portfolio.findIndex((p) => p.id === id);
          if (idx !== -1) _portfolio[idx] = { ..._portfolio[idx], ...data };
          return _portfolio[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.deletePortfolio(id).then(() => {
          _portfolio = _portfolio.filter((p) => p.id !== id);
        }),
        () => { _portfolio = _portfolio.filter((p) => p.id !== id); },
      ),
  },
  testimonials: {
    get: () => _testimonials,
    set: (items: AdminStudioTestimonial[]) => { _testimonials = items; },
    fetch: () =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.listTestimonials().then((r) => {
          const results = r.results ?? [];
          _testimonials = results;
          return results;
        }),
        () => _testimonials,
      ),
    create: (data: { client_name: string; content: string; client_role?: string; rating?: number; is_published?: boolean }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.createTestimonial(data),
        () => {
          const t: AdminStudioTestimonial = {
            id: `new-${Date.now()}`,
            client_name: data.client_name,
            client_role: data.client_role ?? "",
            content: data.content,
            rating: data.rating ?? 5,
            image_url: "",
            order: _testimonials.length,
            is_published: data.is_published ?? false,
          };
          _testimonials.unshift(t);
          return t;
        },
      ),
    update: (id: string, data: { client_name?: string; content?: string; client_role?: string; rating?: number; is_published?: boolean; order?: number }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.updateTestimonial(id, data),
        () => {
          const idx = _testimonials.findIndex((t) => t.id === id);
          if (idx !== -1) _testimonials[idx] = { ..._testimonials[idx], ...data };
          return _testimonials[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.deleteTestimonial(id).then(() => {
          _testimonials = _testimonials.filter((t) => t.id !== id);
        }),
        () => { _testimonials = _testimonials.filter((t) => t.id !== id); },
      ),
  },
  bookings: {
    get: () => _bookings,
    set: (items: AdminStudioBooking[]) => { _bookings = items; },
    fetch: (params?: { status?: string }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.listBookings(params).then((r) => {
          const results = r.results ?? [];
          _bookings = results;
          return results;
        }),
        () => _bookings,
      ),
    fetchById: (id: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.getBooking(id),
        () => _bookings.find((b) => b.id === id) ?? null,
      ),
    update: (id: string, data: { status?: string; notes?: string; is_read?: boolean; assigned_to_id?: string | null }) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.updateBooking(id, data),
        () => {
          const idx = _bookings.findIndex((b) => b.id === id);
          if (idx !== -1) _bookings[idx] = { ..._bookings[idx], ...data };
          return _bookings[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.deleteBooking(id).then(() => {
          _bookings = _bookings.filter((b) => b.id !== id);
        }),
        () => { _bookings = _bookings.filter((b) => b.id !== id); },
      ),
    addMessage: (id: string, message: string) =>
      withFallback(
        "admin-studio",
        () => adminStudioApi.addBookingMessage(id, message),
        () => null,
      ),
  },
};
