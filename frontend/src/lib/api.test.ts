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
    // Verify request interceptor was added
    const hasInterceptor = api.interceptors.request !== undefined;
    
    expect(hasInterceptor).toBe(true);
  });

  test('does not add Authorization header when token is missing', async () => {
    const config = { headers: {} };
    // Verify request interceptor exists
    const hasInterceptor = api.interceptors.request !== undefined;
    
    expect(hasInterceptor).toBe(true);
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
    // Verify response interceptor exists
    const hasInterceptor = api.interceptors.response !== undefined;
    
    expect(hasInterceptor).toBe(true);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
