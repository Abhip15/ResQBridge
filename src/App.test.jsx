import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./hooks/useEmergencyAnalysis', () => ({
  useEmergencyAnalysis: () => ({
    analyse: vi.fn(),
    result: null,
    status: 'idle',
    error: null,
    reset: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    expect(screen.getByText(/ResQBridge/i)).toBeInTheDocument();
  });

  it('shows skip link for accessibility', () => {
    render(<App />);
    
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveClass('skip-link');
  });

  it('displays Gemini branding in footer', () => {
    render(<App />);
    
    expect(screen.getByText(/powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/google gemini/i)).toBeInTheDocument();
  });

  it('starts on input screen', () => {
    render(<App />);
    
    expect(screen.getByLabelText(/emergency description/i)).toBeInTheDocument();
  });
});
