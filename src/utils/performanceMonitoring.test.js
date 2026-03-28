import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PerformanceMonitor, performanceMonitor } from './performanceMonitoring';
import * as analyticsService from './analyticsService';

vi.mock('./analyticsService');

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceMonitor.marks.clear();
  });

  it('tracks operation duration', () => {
    performanceMonitor.start('test_operation');
    
    // Simulate some work
    const startTime = performance.now();
    while (performance.now() - startTime < 10) {
      // busy wait
    }
    
    const duration = performanceMonitor.end('test_operation');
    
    expect(duration).toBeGreaterThan(0);
    expect(analyticsService.logAnalyticsEvent).toHaveBeenCalledWith(
      'performance_metric',
      expect.objectContaining({
        operation: 'test_operation',
        duration_ms: expect.any(Number),
      })
    );
  });

  it('handles missing start mark', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const duration = performanceMonitor.end('non_existent');
    
    expect(duration).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No start mark found')
    );
  });

  it('cleans up marks after end', () => {
    performanceMonitor.start('test_op');
    performanceMonitor.end('test_op');
    
    expect(performanceMonitor.marks.has('test_op')).toBe(false);
  });

  it('supports additional parameters', () => {
    performanceMonitor.start('test_op');
    performanceMonitor.end('test_op', { custom_param: 'value' });
    
    expect(analyticsService.logAnalyticsEvent).toHaveBeenCalledWith(
      'performance_metric',
      expect.objectContaining({
        custom_param: 'value',
      })
    );
  });
});
