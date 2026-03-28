import { describe, it, expect } from 'vitest';
import { padTime } from './formatters';

describe('formatters', () => {
  describe('padTime', () => {
    it('pads single digit numbers', () => {
      expect(padTime(5)).toBe('05');
      expect(padTime(0)).toBe('00');
      expect(padTime(9)).toBe('09');
    });

    it('does not pad double digit numbers', () => {
      expect(padTime(10)).toBe('10');
      expect(padTime(59)).toBe('59');
      expect(padTime(99)).toBe('99');
    });

    it('handles negative numbers', () => {
      expect(padTime(-5)).toBe('-5');
    });
  });
});
