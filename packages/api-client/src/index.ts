import { env } from '@sme-tv/config';

export type ApiClientOptions = { baseUrl?: string; headers?: Record<string, string> };

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? env.apiUrl;
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...options.headers, ...init.headers },
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    return response.json() as Promise<T>;
  }
  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  };
}
