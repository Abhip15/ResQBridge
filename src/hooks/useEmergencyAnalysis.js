import { useState, useRef, useCallback } from 'react';
import { analyseEmergency } from '../utils/geminiService';

/** Debounce window in milliseconds */
const DEBOUNCE_MS = 1000;

/**
 * useEmergencyAnalysis — encapsulates all state and logic for the
 * Gemini emergency analysis API call.
 *
 * @returns {{
 *   analyse: (transcript: string, imageFile: File|null) => Promise<void>,
 *   result: object|null,
 *   status: 'idle'|'loading'|'success'|'error'|'fallback',
 *   error: string|null,
 *   reset: () => void,
 * }}
 */
export function useEmergencyAnalysis() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /** Cache the last successful result so navigating back doesn't re-fetch */
  const cachedResultRef = useRef(null);

  /** AbortController for in-flight requests */
  const abortRef = useRef(null);

  /** Timestamp of last analyse call for debounce */
  const lastCallRef = useRef(0);

  /**
   * Abort any in-flight request, clear cache, and reset all state to idle.
   */
  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    cachedResultRef.current = null;
    lastCallRef.current = 0;
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  /**
   * Run the Gemini analysis. Debounced, abortable, and cached.
   * @param {string} transcript
   * @param {File|null} imageFile
   */
  const analyse = useCallback(async (transcript, imageFile = null) => {
    /* ── Debounce: ignore rapid double-taps ── */
    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) return;
    lastCallRef.current = now;

    /* ── Return cached result if available ── */
    if (cachedResultRef.current) {
      setResult(cachedResultRef.current.result);
      setStatus(cachedResultRef.current.status);
      setError(cachedResultRef.current.error);
      return;
    }

    /* ── Abort any previous in-flight request ── */
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const response = await analyseEmergency(transcript, imageFile);

      /* ── If this request was aborted while awaiting, bail out ── */
      if (controller.signal.aborted) return;

      if (response.error) {
        /* Service returned a user-facing error (e.g. image too large) */
        setError(response.error);
        setStatus('error');
        cachedResultRef.current = null;
        return;
      }

      if (response.usedFallback) {
        const fallbackError =
          'Live analysis unavailable \u2014 showing example response';
        setResult(response.result);
        setError(fallbackError);
        setStatus('fallback');
        /* Do NOT cache fallback results — allow retry on next submission */
      } else {
        setResult(response.result);
        setError(null);
        setStatus('success');
        cachedResultRef.current = {
          result: response.result,
          status: 'success',
          error: null,
        };
      }
    } catch {
      if (controller.signal.aborted) return;
      const msg = 'Unable to process request. Please try again.';
      setError(msg);
      setStatus('error');
      cachedResultRef.current = null;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  return { analyse, result, status, error, reset };
}
