import { useCallback, useState } from 'react';
import { bookmarkStorage } from '../../../services/bookmarkStorage';

export function useBookmarks(notify: (message: string) => void) {
  const [bookmarks, setBookmarks] = useState<string[]>(bookmarkStorage.load);

  const toggleBookmark = useCallback((id: string, _title: string) => {
    setBookmarks((current) => {
      const exists = current.includes(id);
      const updated = exists ? current.filter((item) => item !== id) : [...current, id];
      bookmarkStorage.save(updated);
      notify(exists ? 'Retiré des enregistrements' : 'Enregistré dans vos favoris');
      return updated;
    });
  }, [notify]);

  return { bookmarks, toggleBookmark };
}
