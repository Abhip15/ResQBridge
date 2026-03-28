import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimiter } from './rateLimiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    rateLimiter.reset();
    vi.useFakeTimers();
  });

  it('allows requests within limit', () => {
    for (let i = 0; i < 5; i++) {
      const result = rateLimiter.checkLimit();
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks requests exceeding limit', () => {
    // Make 5 requests (max allowed)
    for (let i = 0; i < 5; i++) {
      rateLimiter.checkLimit();
    }

    // 6th request should be blocked
    const result = rateLimiter.checkLimit();
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('resets after time window', () => {
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      rateLimiter.checkLimit();
    }

    // Advance time past the window
    vi.advanceTimersByTime(61000); // 61 seconds

    // Should allow new requests
    const result = rateLimiter.checkLimit();
    expect(result.allowed).toBe(true);
  });

  it('calculates correct retry time', () => {
    for (let i = 0; i < 5; i++) {
      rateLimiter.checkLimit();
    }

    const result = rateLimiter.checkLimit();
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(60);
  });
});
