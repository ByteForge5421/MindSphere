import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { ReactNode } from 'react';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

import { api } from '@/lib/api';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('AuthProvider', () => {
    test('renders children correctly', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current).toBeTruthy();
    });

    test('initializes with no user when no token in localStorage', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('loads user profile when token exists in localStorage', async () => {
      localStorage.setItem('token', 'test-token-123');
      
      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );
      
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    test('logs in user successfully', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const mockResponse = {
        data: {
          token: 'auth-token-123',
          user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'student',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.token).toBe('auth-token-123');
      expect(result.current.user).toEqual(mockResponse.data.user);
      expect(localStorage.getItem('token')).toBe('auth-token-123');
    });

    test('handles login error', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      vi.mocked(api.post).mockRejectedValueOnce(new Error('Login failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrongpassword');
        })
      ).rejects.toThrow();
    });
  });

  describe('register', () => {
    test('registers user successfully', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const mockResponse = {
        data: {
          token: 'auth-token-456',
          user: {
            id: 'user-456',
            name: 'New User',
            email: 'newuser@example.com',
            role: 'student',
            createdAt: new Date().toISOString(),
          },
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register('New User', 'newuser@example.com', 'password123', 'student');
      });

      expect(result.current.token).toBe('auth-token-456');
      expect(result.current.user).toEqual(mockResponse.data.user);
    });

    test('handles registration error', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      vi.mocked(api.post).mockRejectedValueOnce(new Error('Registration failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register('User', 'user@example.com', 'pass', 'student');
        })
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    test('clears user and token on logout', async () => {
      localStorage.setItem('token', 'test-token-123');

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
