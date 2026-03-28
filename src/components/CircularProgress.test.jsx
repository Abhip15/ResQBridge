import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CircularProgress from './CircularProgress';

describe('CircularProgress', () => {
  it('renders with correct score', () => {
    render(<CircularProgress score={0.85} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('handles zero score', () => {
    render(<CircularProgress score={0} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles perfect score', () => {
    render(<CircularProgress score={1.0} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<CircularProgress score={0.5} size={200} />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('has proper accessibility attributes', () => {
    render(<CircularProgress score={0.75} />);
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });
});
