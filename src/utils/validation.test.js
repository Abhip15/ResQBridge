import { describe, it, expect } from 'vitest';
import { validateTranscript, validateImageFile, validateGeminiResponse } from './validation';

describe('validation', () => {
  describe('validateTranscript', () => {
    it('accepts valid transcript', () => {
      const result = validateTranscript('Multi-vehicle collision on NH-48');
      expect(result.valid).toBe(true);
    });

    it('rejects empty transcript', () => {
      const result = validateTranscript('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('rejects whitespace-only transcript', () => {
      const result = validateTranscript('   ');
      expect(result.valid).toBe(false);
    });

    it('rejects too short transcript', () => {
      const result = validateTranscript('Help');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('more details');
    });

    it('rejects too long transcript', () => {
      const result = validateTranscript('A'.repeat(1001));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('1000 character');
    });

    it('rejects non-string input', () => {
      const result = validateTranscript(null);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateImageFile', () => {
    it('accepts null image (optional)', () => {
      const result = validateImageFile(null);
      expect(result.valid).toBe(true);
    });

    it('accepts valid JPEG', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('accepts valid PNG', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid format', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid image format');
    });

    it('rejects oversized image', () => {
      const largeData = new Uint8Array(5 * 1024 * 1024);
      const file = new File([largeData], 'large.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds 4MB');
    });
  });

  describe('validateGeminiResponse', () => {
    const validResponse = {
      location: 'Test',
      incident_type: 'Accident',
      casualties: { total: 1, critical: 0, description: 'Minor' },
      dispatch: { unit: 'AMB-01', hospital: 'Test', eta_minutes: 5, alert_sent: 'Yes' },
      bystander_instructions: ['Step 1'],
      severity: 'MEDIUM',
      confidence_score: 0.8,
    };

    it('accepts valid response', () => {
      expect(validateGeminiResponse(validResponse)).toBe(true);
    });

    it('rejects missing location', () => {
      const invalid = { ...validResponse };
      delete invalid.location;
      expect(validateGeminiResponse(invalid)).toBe(false);
    });

    it('rejects invalid severity', () => {
      const invalid = { ...validResponse, severity: 'INVALID' };
      expect(validateGeminiResponse(invalid)).toBe(false);
    });

    it('rejects invalid confidence score', () => {
      const invalid = { ...validResponse, confidence_score: 1.5 };
      expect(validateGeminiResponse(invalid)).toBe(false);
    });

    it('rejects missing casualties structure', () => {
      const invalid = { ...validResponse, casualties: null };
      expect(validateGeminiResponse(invalid)).toBe(false);
    });

    it('rejects non-array instructions', () => {
      const invalid = { ...validResponse, bystander_instructions: 'not an array' };
      expect(validateGeminiResponse(invalid)).toBe(false);
    });
  });
});
