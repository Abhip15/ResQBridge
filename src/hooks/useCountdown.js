import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for a countdown timer displayed as minutes:seconds.
 * @param {number} initialMinutes - Starting minutes for countdown.
 * @param {boolean} active - Whether the timer should be running.
 * @returns {{ minutes: number, seconds: number, totalSeconds: number, isComplete: boolean }}
 */
export function useCountdown(initialMinutes, active = true) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active || totalSeconds <= 0) return;

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isComplete = totalSeconds === 0;

  return { minutes, seconds, totalSeconds, isComplete };
}

/**
 * Custom hook to simulate the Gemini analysis loading state.
 * @param {Function} onComplete - Callback when loading completes.
 * @returns {{ isLoading: boolean, startLoading: Function }}
 */
export function useSimulatedLoading(onComplete) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 2000);
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isLoading, startLoading };
}
