import { DEFAULT_BOOKMARKS, STORAGE_KEYS } from '../constants/storage';
import { storage } from './storage';

export const bookmarkStorage = {
  load: (): string[] => storage.get(STORAGE_KEYS.bookmarks, [...DEFAULT_BOOKMARKS]),
  save: (bookmarks: string[]) => storage.set(STORAGE_KEYS.bookmarks, bookmarks),
};
