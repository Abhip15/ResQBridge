import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import * as geminiService from '../../utils/geminiService';

vi.mock('../../utils/geminiService');

describe('Emergency Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full emergency report flow', async () => {
    const mockAnalysisResult = {
      location: 'NH-48, Nelamangala',
      incident_type: 'Multi-vehicle collision',
      casualties: { total: 3, critical: 1, description: 'One critical, two minor' },
      dispatch: {
        unit: 'AMB-108-BLR-01',
        hospital: 'Manipal Hospital, Whitefield',
        eta_minutes: 7,
        alert_sent: 'Dispatched at 14:32',
      },
      bystander_instructions: [
        'Ensure scene safety',
        'Call emergency services',
        'Provide first aid',
      ],
      severity: 'HIGH',
      confidence_score: 0.85,
    };

    geminiService.analyseEmergency.mockResolvedValue({
      result: mockAnalysisResult,
      usedFallback: false,
    });

    render(<App />);

    // Fill in transcript
    const textarea = screen.getByLabelText(/emergency description/i);
    fireEvent.change(textarea, {
      target: { value: 'Multi-vehicle collision on NH-48' },
    });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /report emergency/i });
    fireEvent.click(submitBtn);

    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText(/analysing/i)).toBeInTheDocument();
    });

    // Wait for results
    await waitFor(
      () => {
        expect(screen.getByText(/incident summary/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify results are displayed
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('NH-48, Nelamangala')).toBeInTheDocument();
    expect(screen.getByText('Multi-vehicle collision')).toBeInTheDocument();

    // Reset and return to input
    const resetBtn = screen.getByRole('button', { name: /report another emergency/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/emergency description/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    geminiService.analyseEmergency.mockResolvedValue({
      result: {},
      usedFallback: true,
      error: 'API unavailable',
    });

    render(<App />);

    const textarea = screen.getByLabelText(/emergency description/i);
    fireEvent.change(textarea, { target: { value: 'Test emergency' } });

    const submitBtn = screen.getByRole('button', { name: /report emergency/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
