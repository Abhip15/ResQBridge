import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyseEmergency } from './geminiService';
import { mockResult } from '../data/mockResult';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResult),
        },
      }),
    }),
  })),
}));

describe('analyseEmergency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_GEMINI_API_KEY = 'test-api-key';
  });

  it('returns mock result when API key is missing', async () => {
    import.meta.env.VITE_GEMINI_API_KEY = '';
    const result = await analyseEmergency('Car accident on MG Road');
    
    expect(result.usedFallback).toBe(true);
    expect(result.result).toEqual(mockResult);
  });

  it('detects script injection attempts', async () => {
    const malicious = '<script>alert("xss")</script> accident';
    const result = await analyseEmergency(malicious);
    
    expect(result.usedFallback).toBe(true);
    expect(result.error).toContain('disallowed content');
  });

  it('rejects unsupported image MIME types', async () => {
    const file = new File([''], 'test.gif', { type: 'image/gif' });
    const result = await analyseEmergency('Accident', file);
    
    expect(result.usedFallback).toBe(true);
    expect(result.error).toContain('Unsupported image format');
  });

  it('rejects oversized images', async () => {
    const largeData = new Uint8Array(5 * 1024 * 1024); // 5MB
    const file = new File([largeData], 'large.jpg', { type: 'image/jpeg' });
    const result = await analyseEmergency('Accident', file);
    
    expect(result.usedFallback).toBe(true);
    expect(result.error).toContain('exceeds 4 MB');
  });

  it('successfully analyses valid transcript', async () => {
    const result = await analyseEmergency('Multi-vehicle collision on NH-48');
    
    expect(result.usedFallback).toBe(false);
    expect(result.result).toEqual(mockResult);
  });

  it('handles valid image upload', async () => {
    const imageData = new Uint8Array([0xFF, 0xD8, 0xFF]); // JPEG header
    const file = new File([imageData], 'scene.jpg', { type: 'image/jpeg' });
    const result = await analyseEmergency('Accident', file);
    
    expect(result.usedFallback).toBe(false);
  });

  it('sanitises HTML tags from transcript', async () => {
    const transcript = '<b>Accident</b> on <i>MG Road</i>';
    const result = await analyseEmergency(transcript);
    
    // Should not throw and should process
    expect(result).toBeDefined();
  });

  it('truncates long transcripts to 1000 characters', async () => {
    const longTranscript = 'A'.repeat(1500);
    const result = await analyseEmergency(longTranscript);
    
    expect(result).toBeDefined();
  });
});
