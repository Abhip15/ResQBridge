import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEmergencyAnalysis } from './useEmergencyAnalysis';
import * as geminiService from '../utils/geminiService';

vi.mock('../utils/geminiService');

describe('useEmergencyAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with idle status', () => {
    const { result } = renderHook(() => useEmergencyAnalysis());
    
    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('transitions to loading state when analyse is called', async () => {
    geminiService.analyseEmergency.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ result: {}, usedFallback: false }), 100))
    );

    const { result } = renderHook(() => useEmergencyAnalysis());
    
    act(() => {
      result.current.analyse('Test transcript');
    });

    expect(result.current.status).toBe('loading');
  });

  it('sets success status on successful analysis', async () => {
    const mockData = { location: 'Test', severity: 'HIGH' };
    geminiService.analyseEmergency.mockResolvedValue({ result: mockData, usedFallback: false });

    const { result } = renderHook(() => useEmergencyAnalysis());
    
    await act(async () => {
      await result.current.analyse('Test transcript');
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.result).toEqual(mockData);
    });
  });

  it('sets fallback status when fallback is used', async () => {
    const mockData = { location: 'Test', severity: 'HIGH' };
    geminiService.analyseEmergency.mockResolvedValue({ result: mockData, usedFallback: true });

    const { result } = renderHook(() => useEmergencyAnalysis());
    
    await act(async () => {
      await result.current.analyse('Test transcript');
    });

    await waitFor(() => {
      expect(result.current.status).toBe('fallback');
    });
  });

  it('debounces rapid calls', async () => {
    geminiService.analyseEmergency.mockResolvedValue({ result: {}, usedFallback: false });

    const { result } = renderHook(() => useEmergencyAnalysis());
    
    act(() => {
      result.current.analyse('First');
      result.current.analyse('Second');
      result.current.analyse('Third');
    });

    // Should only call once due to debounce
    expect(geminiService.analyseEmergency).toHaveBeenCalledTimes(1);
  });

  it('resets state correctly', async () => {
    const mockData = { location: 'Test', severity: 'HIGH' };
    geminiService.analyseEmergency.mockResolvedValue({ result: mockData, usedFallback: false });

    const { result } = renderHook(() => useEmergencyAnalysis());
    
    await act(async () => {
      await result.current.analyse('Test');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
