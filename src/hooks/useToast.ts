import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(duration = 2800) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(nextMessage);
    timerRef.current = setTimeout(() => setMessage(null), duration);
  }, [duration]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { message, showToast };
}
