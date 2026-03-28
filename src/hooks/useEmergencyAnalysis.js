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

  /** AbortController for in-flight requests */
  const abortRef = useRef(null);

  /** Timestamp of last analyse call for debounce */
  const lastCallRef = useRef(0);

  /**
   * Abort any in-flight request and reset all state to idle.
   */
  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    lastCallRef.current = 0;
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  /**
   * Run the Gemini analysis. Debounced and abortable.
   * @param {string} transcript
   * @param {File|null} imageFile
   */
  const analyse = useCallback(async (transcript, imageFile = null) => {
    /* ── Debounce: ignore rapid double-taps ── */
    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) return;
    lastCallRef.current = now;

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
        setError(response.error);
        setStatus('error');
        return;
      }

      if (response.usedFallback) {
        setResult(response.result);
        setError('Live analysis unavailable \u2014 showing example response');
        setStatus('fallback');
      } else {
        setResult(response.result);
        setError(null);
        setStatus('success');
      }
    } catch {
      if (controller.signal.aborted) return;
      setError('Unable to process request. Please try again.');
      setStatus('error');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  return { analyse, result, status, error, reset };
}
