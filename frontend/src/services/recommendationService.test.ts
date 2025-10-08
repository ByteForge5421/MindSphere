import { describe, test, expect, vi } from 'vitest';
import * as recommendationService from './recommendationService';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('recommendationService', () => {
  test('getRecommendations is exported', () => {
    expect(typeof recommendationService.getRecommendations).toBe('function');
  });

  test('getRecommendations function exists', async () => {
    const mockResponse = {
      data: ['recommendation 1', 'recommendation 2'],
    };

    vi.doMock('@/lib/api', () => ({
      api: {
        post: vi.fn().mockResolvedValue(mockResponse),
      },
    }));

    expect(typeof recommendationService.getRecommendations).toBe('function');
  });
});
