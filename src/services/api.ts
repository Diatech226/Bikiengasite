const configuredApiUrl = import.meta.env.VITE_API_URL;
if (!configuredApiUrl) throw new Error('VITE_API_URL doit être configurée au build');
const API_URL = configuredApiUrl.replace(/\/$/, '');
let accessToken: string | null = null;
let refreshToken: string | null = typeof window === 'undefined' ? null : window.sessionStorage.getItem('bikienga_refresh');
export function setTokens(tokens: { accessToken: string; refreshToken?: string } | null) { accessToken = tokens?.accessToken ?? null; if (tokens?.refreshToken) refreshToken = tokens.refreshToken; if (!tokens) refreshToken = null; if (typeof window !== 'undefined') { if (refreshToken) window.sessionStorage.setItem('bikienga_refresh', refreshToken); else window.sessionStorage.removeItem('bikienga_refresh'); } }
export function hasRefreshToken() { return Boolean(refreshToken); }
export async function apiRequest<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
 const headers = new Headers(options.headers); if (options.body) headers.set('Content-Type','application/json'); if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);
 const response=await fetch(`${API_URL}${path}`,{...options,headers});
 if(response.status===401&&retry&&refreshToken){const refresh=await fetch(`${API_URL}/auth/refresh`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken})});if(refresh.ok){setTokens(await refresh.json());return apiRequest(path,options,false)}setTokens(null)}
 if(!response.ok){let message=`Erreur HTTP ${response.status}`;try{const body=await response.json();const detail=body?.error?.message??body?.message??body?.error;if(Array.isArray(detail))message=detail.join(', ');else if(typeof detail==='string')message=detail}catch{}throw new Error(message)}
 return response.status===204?undefined as T:response.json();
}
