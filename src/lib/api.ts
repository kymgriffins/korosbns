import { API_BASE_URL } from './api-config';

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  _retry?: boolean;
};

async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { params, ...init } = config;
  
  // Construct URL with params
  let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + searchParams.toString();
  }

  // Set default headers
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add token if available (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(fullUrl, {
      ...init,
      headers,
    });

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401 && !config._retry) {
      config._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResponse.ok) {
          // Retry the original request
          return request<T>(url, config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
      }

      // If refresh fails or no retry possible, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
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
