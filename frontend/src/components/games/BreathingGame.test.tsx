import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BreathingGame } from './BreathingGame';

describe('BreathingGame', () => {
  test('renders breathing game component', () => {
    const { container } = render(
      <BreathingGame />
    );

    expect(container).toBeInTheDocument();
  });

  test('displays breathing exercise title', () => {
    render(
      <BreathingGame />
    );

    // Check for the main heading
    expect(screen.getByRole('heading', { name: /Deep Breathing Exercise/i })).toBeInTheDocument();
  });

  test('displays breathing instructions', () => {
    render(
      <BreathingGame />
    );

    // Check for breathing instruction text
    expect(screen.getByRole('heading', { name: /Breathe/i })).toBeInTheDocument();
  });
});
