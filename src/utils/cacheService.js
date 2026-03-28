/**
 * Simple in-memory cache with TTL for API responses
 */

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate cache key from transcript and image presence
   * @param {string} transcript
   * @param {boolean} hasImage
   * @returns {string}
   */
  generateKey(transcript, hasImage) {
    const normalized = transcript.toLowerCase().trim();
    return `${normalized}_${hasImage}`;
  }

  /**
   * Get cached result if available and not expired
   * @param {string} key
   * @param {number} ttlMs - Time to live in milliseconds
   * @returns {object|null}
   */
  get(key, ttlMs = 300000) { // 5 minutes default
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store result in cache
   * @param {string} key
   * @param {object} data
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limit cache size to prevent memory issues
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Clear all cached entries
   */
  clear() {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
