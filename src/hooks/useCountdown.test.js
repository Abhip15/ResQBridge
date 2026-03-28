import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with correct time', () => {
    const { result } = renderHook(() => useCountdown(5));
    
    expect(result.current.minutes).toBe(5);
    expect(result.current.seconds).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  it('counts down correctly', () => {
    const { result } = renderHook(() => useCountdown(1));
    
    act(() => {
      vi.advanceTimersByTime(30000); // 30 seconds
    });
    
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(30);
  });

  it('completes countdown', () => {
    const { result } = renderHook(() => useCountdown(1));
    
    act(() => {
      vi.advanceTimersByTime(60000); // 60 seconds
    });
    
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.isComplete).toBe(true);
  });

  it('does not count when inactive', () => {
    const { result } = renderHook(() => useCountdown(5, false));
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(result.current.minutes).toBe(5);
    expect(result.current.seconds).toBe(0);
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = renderHook(() => useCountdown(5));
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
