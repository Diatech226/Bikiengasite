import { STORAGE_KEYS } from '../constants/storage';
import { storage } from './storage';

// Authentification de démonstration uniquement : ce service sera remplacé par l'API.
const TEMPORARY_ADMIN_CODES = new Set(['1234', 'admin', '2026']);

export const adminAuth = {
  hasSession: () => storage.get(STORAGE_KEYS.adminAuthenticated, false),
  authenticate: (pin: string) => {
    const accepted = TEMPORARY_ADMIN_CODES.has(pin.toLowerCase());
    if (accepted) storage.set(STORAGE_KEYS.adminAuthenticated, true);
    return accepted;
  },
  openDemoSession: () => storage.set(STORAGE_KEYS.adminAuthenticated, true),
  logout: () => storage.remove(STORAGE_KEYS.adminAuthenticated),
};
