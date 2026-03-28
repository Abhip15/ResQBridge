/**
 * Simple client-side rate limiter to prevent API abuse
 */

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

class RateLimiter {
  constructor() {
    this.requests = [];
  }

  /**
   * Check if a new request is allowed
   * @returns {{ allowed: boolean, retryAfter?: number }}
   */
  checkLimit() {
    const now = Date.now();
    
    // Remove requests outside the current window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (this.requests.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldestRequest = Math.min(...this.requests);
      const retryAfter = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW_MS - now) / 1000);
      
      return { allowed: false, retryAfter };
    }

    this.requests.push(now);
    return { allowed: true };
  }

  /**
   * Reset the rate limiter
   */
  reset() {
    this.requests = [];
  }
}

export const rateLimiter = new RateLimiter();
