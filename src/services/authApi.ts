import { apiRequest, hasRefreshToken, setTokens } from './api';

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN';
}

function loginError(cause: unknown): Error {
  const message = cause instanceof Error ? cause.message : '';
  if (/401|identifiant|credential/i.test(message)) return new Error('Identifiants incorrects');
  if (/403|interdit|forbidden/i.test(message)) return new Error("Vous n’êtes pas autorisé à accéder à l’administration");
  if (/API_UNAVAILABLE|network|fetch/i.test(message)) return new Error("Le serveur d’administration est indisponible");
  return new Error('Impossible de se connecter pour le moment');
}

export const authApi = {
  async login(email: string, password: string): Promise<AdminUser> {
    try {
      const result = await apiRequest<{ accessToken: string; refreshToken: string; user: AdminUser }>('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password }),
      });
      setTokens(result);
      return result.user;
    } catch (cause) {
      setTokens(null);
      throw loginError(cause);
    }
  },
  async restore(): Promise<AdminUser | null> {
    if (!hasRefreshToken()) return null;
    try { return await apiRequest<AdminUser>('/auth/me'); }
    catch { setTokens(null); return null; }
  },
  async logout(): Promise<void> {
    try { await apiRequest('/auth/logout', { method: 'POST' }); }
    finally { setTokens(null); }
  },
};
