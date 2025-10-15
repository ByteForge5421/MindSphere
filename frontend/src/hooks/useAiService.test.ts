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

  test('initializes with methods', () => {
    const { result } = renderHook(() => useAiService());
    
    expect(typeof result.current.analyzeVoice).toBe('function');
    expect(typeof result.current.analyzeText).toBe('function');
    expect(typeof result.current.generateRecommendations).toBe('function');
  });

  test('has analyze text method', () => {
    const { result } = renderHook(() => useAiService());

    expect(typeof result.current.analyzeText).toBe('function');
  });

  test('has generate recommendations method', () => {
    const { result } = renderHook(() => useAiService());

    expect(typeof result.current.generateRecommendations).toBe('function');
  });
});
