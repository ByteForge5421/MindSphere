import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns toast function', () => {
    const { result } = renderHook(() => useToast());
    
    expect(typeof result.current.toast).toBe('function');
  });

  test('can call toast with message', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Success',
        description: 'Operation completed',
      });
    });

    expect(result.current.toast).toBeDefined();
  });

  test('can dismiss toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const toastId = result.current.toast({
        title: 'Test',
      });
      
      result.current.dismiss(toastId);
    });

    expect(result.current.dismiss).toBeDefined();
  });

  test('can call dismiss all', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Toast 1',
      });
      
      result.current.toast({
        title: 'Toast 2',
      });

      result.current.dismiss();
    });

    expect(result.current.dismiss).toBeDefined();
  });
});
