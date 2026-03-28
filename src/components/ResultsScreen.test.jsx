import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultsScreen from './ResultsScreen';
import { mockResult } from '../data/mockResult';

vi.mock('../hooks/useCountdown', () => ({
  useCountdown: () => ({
    minutes: 5,
    seconds: 30,
    isComplete: false,
  }),
}));

describe('ResultsScreen', () => {
  const mockReset = vi.fn();

  const defaultProps = {
    result: mockResult,
    status: 'success',
    error: null,
    onReset: mockReset,
  };

  it('renders incident summary', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByText(/incident summary/i)).toBeInTheDocument();
    expect(screen.getByText(mockResult.incident_type)).toBeInTheDocument();
  });

  it('displays severity badge', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByText(mockResult.severity)).toBeInTheDocument();
  });

  it('shows dispatch details', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByText(/dispatch details/i)).toBeInTheDocument();
    expect(screen.getByText(mockResult.dispatch.unit)).toBeInTheDocument();
  });

  it('displays bystander instructions', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByText(/bystander instructions/i)).toBeInTheDocument();
    mockResult.bystander_instructions.forEach((instruction) => {
      expect(screen.getByText(instruction)).toBeInTheDocument();
    });
  });

  it('shows confidence score', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByText(/analysis confidence/i)).toBeInTheDocument();
  });

  it('displays fallback warning', () => {
    render(<ResultsScreen {...defaultProps} status="fallback" error="Test warning" />);
    
    expect(screen.getByRole('alert')).toHaveTextContent('Test warning');
  });

  it('calls onReset when reset button clicked', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    const resetBtn = screen.getByRole('button', { name: /report another emergency/i });
    resetBtn.click();
    
    expect(mockReset).toHaveBeenCalled();
  });

  it('has proper ARIA labels', () => {
    render(<ResultsScreen {...defaultProps} />);
    
    expect(screen.getByLabelText(/emergency analysis results/i)).toBeInTheDocument();
  });
});
