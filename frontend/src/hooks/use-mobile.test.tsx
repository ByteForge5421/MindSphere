import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMatchMediaMock = (isMobile: boolean) => {
    return vi.fn((query: string) => ({
      matches: query === '(max-width: 767px)' ? isMobile : !isMobile,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }));
  };

  test('returns false on desktop', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMatchMediaMock(false),
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test('returns true on mobile', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMatchMediaMock(true),
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Mobile width
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
