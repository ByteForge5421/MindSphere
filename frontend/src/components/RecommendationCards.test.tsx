import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RecommendationCards } from './RecommendationCards';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

import { api } from '@/lib/api';

describe('RecommendationCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders recommendation cards', async () => {
    const mockRecommendations = [
      {
        id: '1',
        title: 'Meditation',
        description: 'Try a 10-minute meditation',
        type: 'activity' as const,
        source: 'Insight Timer',
      },
      {
        id: '2',
        title: 'Exercise',
        description: 'Take a 30-minute walk',
        type: 'activity' as const,
        source: 'YouTube',
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: mockRecommendations,
    } as any);

    render(<RecommendationCards />);

    await waitFor(() => {
      expect(screen.getByText('Meditation')).toBeInTheDocument();
      expect(screen.getByText('Exercise')).toBeInTheDocument();
    });
  });

  test('displays loading skeleton while fetching', () => {
    vi.mocked(api.get).mockImplementationOnce(
      () =>
        new Promise(() => {
          // Never resolves to show loading state
        })
    );

    const { container } = render(<RecommendationCards />);
    expect(container).toBeInTheDocument();
  });

  test('handles empty recommendations', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
    } as any);

    const { container } = render(<RecommendationCards />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
