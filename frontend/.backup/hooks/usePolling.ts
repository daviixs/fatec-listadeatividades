import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook genérico de polling que executa uma callback em intervalos regulares.
 * @param callback - Função a ser executada periodicamente
 * @param intervalMs - Intervalo em milissegundos
 * @param enabled - Se o polling está ativo (default: true)
 */
export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const tick = useCallback(() => {
    savedCallback.current();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Executa imediatamente na primeira vez
    tick();

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled, tick]);
}
