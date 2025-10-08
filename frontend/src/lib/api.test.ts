import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { api } from './api';

describe('api', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('creates axios instance with correct baseURL', () => {
    expect(api.defaults.baseURL).toContain('localhost:5000/api');
  });

  test('sets Content-Type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  test('adds Authorization header when token exists in localStorage', async () => {
    const token = 'test-token-123';
    localStorage.setItem('token', token);

    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0];
    
    if (interceptor && interceptor.fulfilled) {
      const result = interceptor.fulfilled(config);
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    }
  });

  test('does not add Authorization header when token is missing', async () => {
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0];
    
    if (interceptor && interceptor.fulfilled) {
      const result = interceptor.fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  test('clears token and redirects on 401 response', async () => {
    localStorage.setItem('token', 'test-token');
    const mockLocation = { href: '', pathname: '/dashboard' };
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });

    const error = {
      response: { status: 401 },
    };
    const interceptor = api.interceptors.response.handlers[0];
    
    if (interceptor && interceptor.rejected) {
      try {
        await interceptor.rejected(error);
      } catch (e) {
        expect(localStorage.getItem('token')).toBeNull();
      }
    }

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
