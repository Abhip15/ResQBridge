import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheService } from './cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    vi.useFakeTimers();
  });

  it('generates consistent keys', () => {
    const key1 = cacheService.generateKey('Test transcript', true);
    const key2 = cacheService.generateKey('Test transcript', true);
    
    expect(key1).toBe(key2);
  });

  it('normalizes transcript for key generation', () => {
    const key1 = cacheService.generateKey('  Test  ', false);
    const key2 = cacheService.generateKey('test', false);
    
    expect(key1).toBe(key2);
  });

  it('stores and retrieves cached data', () => {
    const key = 'test_key';
    const data = { result: 'test' };
    
    cacheService.set(key, data);
    const retrieved = cacheService.get(key);
    
    expect(retrieved).toEqual(data);
  });

  it('returns null for non-existent keys', () => {
    const result = cacheService.get('non_existent');
    
    expect(result).toBeNull();
  });

  it('expires cached data after TTL', () => {
    const key = 'test_key';
    const data = { result: 'test' };
    
    cacheService.set(key, data);
    
    // Advance time past TTL
    vi.advanceTimersByTime(301000); // 5 minutes + 1 second
    
    const result = cacheService.get(key, 300000);
    expect(result).toBeNull();
  });

  it('limits cache size to 50 entries', () => {
    for (let i = 0; i < 60; i++) {
      cacheService.set(`key_${i}`, { data: i });
    }
    
    // First 10 entries should be evicted
    expect(cacheService.get('key_0')).toBeNull();
    expect(cacheService.get('key_59')).toBeDefined();
  });

  it('clears all cached entries', () => {
    cacheService.set('key1', { data: 1 });
    cacheService.set('key2', { data: 2 });
    
    cacheService.clear();
    
    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBeNull();
  });
});
