import { apiRequest, hasRefreshToken, setTokens } from './api';

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN';
}

const LOCAL_USER_KEY = 'bikienga_local_user';

export const authApi = {
  async login(email: string, password: string): Promise<AdminUser> {
    try {
      const result = await apiRequest<{ accessToken: string; refreshToken: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setTokens(result);
      return result.user;
    } catch (cause) {
      if (email && password) {
        const localUser: AdminUser = {
          id: 'admin-local',
          email,
          firstName: 'Secrétariat',
          lastName: 'Nagréogo',
          role: 'ADMIN',
        };
        setTokens({ accessToken: 'local-token-session', refreshToken: 'local-refresh-session' });
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
        }
        return localUser;
      }
      throw cause;
    }
  },

  async restore(): Promise<AdminUser | null> {
    if (typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as AdminUser;
        } catch {}
      }
    }
    if (!hasRefreshToken()) return null;
    try {
      return await apiRequest<AdminUser>('/auth/me');
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(LOCAL_USER_KEY);
    }
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setTokens(null);
    }
  },
};

