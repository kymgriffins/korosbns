import { apiFetch } from "./api-client";

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  auth?: boolean;
};

async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const path = url.startsWith("/api/v1") ? url.replace("/api/v1", "") : url;
  return apiFetch<T>(path, { ...config, auth: true });
}

export const api = {
  get: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'GET' }),
  post: <T>(url: string, data?: any, config?: RequestConfig) => 
    request<T>(url, { ...config, method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(url: string, data?: any, config?: RequestConfig) => 
    request<T>(url, { ...config, method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(url: string, data?: any, config?: RequestConfig) => 
    request<T>(url, { ...config, method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'DELETE' }),
};
