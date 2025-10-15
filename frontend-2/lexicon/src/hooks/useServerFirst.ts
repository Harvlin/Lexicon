import { useEffect, useRef, useState } from "react";

type Source = "fallback" | "api";

/**
 * useServerFirst returns fallback data immediately, then swaps to server data when available.
 * - Pass a stable `fetcher` (wrap in useCallback if it captures state).
 * - It exposes `source` so UIs can show a subtle "updated" hint if desired.
 */
export function useServerFirst<T>(
  fallback: T,
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T>(fallback);
  const [source, setSource] = useState<Source>("fallback");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);
    // start with fallback; then try server
    fetcher()
      .then((server) => {
        if (!mounted.current) return;
        setData(server);
        setSource("api");
      })
      .catch((e) => {
        if (!mounted.current) return;
        // keep fallback silently; expose error if caller wants
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!mounted.current) return;
        setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, source, loading, error } as const;
}
