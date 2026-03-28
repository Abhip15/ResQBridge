import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputScreen from './InputScreen';

describe('InputScreen', () => {
  const mockAnalyse = vi.fn();
  const mockNavigate = vi.fn();

  const defaultProps = {
    analyse: mockAnalyse,
    status: 'idle',
    error: null,
    onNavigate: mockNavigate,
  };

  it('renders the form with all elements', () => {
    render(<InputScreen {...defaultProps} />);
    
    expect(screen.getByLabelText(/emergency description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /attach a photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report emergency/i })).toBeInTheDocument();
  });

  it('updates transcript on input', () => {
    render(<InputScreen {...defaultProps} />);
    const textarea = screen.getByLabelText(/emergency description/i);
    
    fireEvent.change(textarea, { target: { value: 'New emergency' } });
    
    expect(textarea.value).toBe('New emergency');
  });

  it('disables submit when transcript is empty', () => {
    render(<InputScreen {...defaultProps} />);
    const textarea = screen.getByLabelText(/emergency description/i);
    const submitBtn = screen.getByRole('button', { name: /report emergency/i });
    
    fireEvent.change(textarea, { target: { value: '' } });
    
    expect(submitBtn).toBeDisabled();
  });

  it('calls analyse on form submit', () => {
    render(<InputScreen {...defaultProps} />);
    const form = screen.getByRole('form', { name: /emergency report form/i });
    
    fireEvent.submit(form);
    
    expect(mockAnalyse).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<InputScreen {...defaultProps} status="loading" />);
    
    expect(screen.getByText(/analysing/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<InputScreen {...defaultProps} status="error" error="Test error" />);
    
    expect(screen.getByRole('alert')).toHaveTextContent('Test error');
  });

  it('navigates to results on success', async () => {
    const { rerender } = render(<InputScreen {...defaultProps} status="loading" />);
    
    rerender(<InputScreen {...defaultProps} status="success" />);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('enforces 1000 character limit', () => {
    render(<InputScreen {...defaultProps} />);
    const textarea = screen.getByLabelText(/emergency description/i);
    
    expect(textarea).toHaveAttribute('maxLength', '1000');
  });
});
