import { describe, it, expect, vi, beforeEach } from 'vitest';
import { matchHospital } from './hospitalMatcher';

/*
 * Seed Math.random to make ETA variance deterministic in tests.
 * random() = 0.5 → variance = floor(0.5 * 5) - 1 = 1
 */
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
});

describe('matchHospital', () => {
  it('matches Manipal Whitefield for NH-48 location', () => {
    const result = matchHospital(
      'NH-48, near Nelamangala Toll',
      'Multi-vehicle collision',
      { total: 4, critical: 1 },
    );
    expect(result.hospital_name).toBe('Manipal Hospital, Whitefield');
    expect(result.eta_minutes).toBe(7); // 6 + 1
    expect(result.reason).toContain('Zone match');
  });

  it('matches NIMHANS or Sakra for Koramangala location', () => {
    const result = matchHospital(
      'Koramangala 5th Block',
      'Road accident',
      { total: 1, critical: 0 },
    );
    // Koramangala is in NIMHANS zones
    expect(result.hospital_name).toBe('NIMHANS');
    expect(result.eta_minutes).toBe(18); // 17 + 1
  });

  it('defaults to Manipal Whitefield for unknown location', () => {
    const result = matchHospital(
      'Some unknown place in the middle of nowhere',
      'Fire',
      { total: 2, critical: 0 },
    );
    expect(result.hospital_name).toBe('Manipal Hospital, Whitefield');
    expect(result.reason).toContain('Default hospital');
  });

  it('prefers trauma-specialised hospital for critical collision', () => {
    // Hebbal is in MS Ramaiah zones (trauma) — should rank it high
    const result = matchHospital(
      'Near Hebbal flyover',
      'Multi-vehicle collision',
      { total: 3, critical: 2 },
    );
    expect(result.hospital_name).toBe('MS Ramaiah Hospital');
    expect(result.reason).toContain('trauma');
  });

  it('handles empty / null inputs gracefully', () => {
    const result = matchHospital('', '', {});
    expect(result.hospital_name).toBe('Manipal Hospital, Whitefield');
    expect(result.reason).toContain('Default hospital');
  });

  it('returns ETA within valid range (base_eta - 1 to base_eta + 3)', () => {
    vi.spyOn(Math, 'random').mockRestore();
    const etas = Array.from({ length: 50 }, () =>
      matchHospital('NH-48', 'crash', { total: 1, critical: 0 }).eta_minutes,
    );
    for (const eta of etas) {
      expect(eta).toBeGreaterThanOrEqual(5);  // 6 - 1
      expect(eta).toBeLessThanOrEqual(9);     // 6 + 3
    }
  });
});
