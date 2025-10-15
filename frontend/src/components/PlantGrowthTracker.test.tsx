import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlantGrowthTracker } from './PlantGrowthTracker';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
  },
}));

describe('PlantGrowthTracker', () => {
  test('renders plant growth tracker', async () => {
    render(
      <PlantGrowthTracker />
    );

    await waitFor(() => {
      expect(screen.queryByText(/plant|growth/i)).toBeTruthy();
    });
  });
});
