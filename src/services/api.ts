const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
export const hasConfiguredApi = Boolean(rawApiUrl);
export const API_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : '';
let accessToken: string | null = null;
let refreshToken: string | null = typeof window === 'undefined' ? null : window.sessionStorage.getItem('bikienga_refresh');

export function setTokens(tokens: { accessToken: string; refreshToken?: string } | null) {
  accessToken = tokens?.accessToken ?? null;
  if (tokens?.refreshToken) refreshToken = tokens.refreshToken;
  if (!tokens) refreshToken = null;
  if (typeof window !== 'undefined') {
    if (refreshToken) window.sessionStorage.setItem('bikienga_refresh', refreshToken);
    else window.sessionStorage.removeItem('bikienga_refresh');
  }
}

export function hasRefreshToken() {
  return Boolean(refreshToken);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  if (!API_URL) {
    throw new Error('API_UNAVAILABLE');
  }

  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('API_UNAVAILABLE');
  }

  if (response.status === 401 && retry && refreshToken) {
    try {
      const refresh = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refresh.ok) {
        setTokens(await refresh.json());
        return apiRequest(path, options, false);
      }
    } catch {}
    setTokens(null);
  }

  if (!response.ok) {
    let message = `Erreur HTTP ${response.status}`;
    try {
      const body = await response.json();
      const detail = body?.error?.message ?? body?.message ?? body?.error;
      if (Array.isArray(detail)) message = detail.join(', ');
      else if (typeof detail === 'string') message = detail;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API_UNAVAILABLE');
  }
  return response.json();
}

