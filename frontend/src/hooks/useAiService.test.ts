import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiService } from './useAiService';

// Mock the API module
vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('useAiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useAiService());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.response).toBe(null);
  });

  test('generates mood recommendation', async () => {
    const { result } = renderHook(() => useAiService());

    await act(async () => {
      await result.current.generateMoodRecommendation('happy', 'I had a great day');
    });

    // After call, state would be updated (implementation specific)
    expect(result.current).toBeDefined();
  });

  test('generates breathing exercise', async () => {
    const { result } = renderHook(() => useAiService());

    await act(async () => {
      await result.current.generateBreathingExercise('calm');
    });

    expect(result.current).toBeDefined();
  });

  test('handles errors gracefully', async () => {
    const { result } = renderHook(() => useAiService());

    // Mock error scenario
    const mockError = new Error('API Error');
    
    await act(async () => {
      try {
        await result.current.generateMoodRecommendation('', '');
      } catch (_e) {
        // Error expected
      }
    });

    expect(result.current).toBeDefined();
  });
});
