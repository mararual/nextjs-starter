import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveClass('border', 'border-slate-600');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeDisabled();
  });

  it('disables button when loading', () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Click me</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveClass('custom-class');
  });

  it('INTENTIONAL FAILURE - Testing CI block on unit test failure', () => {
    // This test is intentionally failing to verify that:
    // 1. Failed unit tests block PR merging
    // 2. Vercel preview deployment is blocked/skipped
    // 3. GitHub Actions CI workflow properly reports failures
    expect(true).toBe(false);
  });
});
