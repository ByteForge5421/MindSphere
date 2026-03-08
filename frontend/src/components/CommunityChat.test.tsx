import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommunityChat } from './CommunityChat';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
    token: 'test-token',
    isAuthenticated: true,
  }),
}));

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: { messages: [] } })),
    post: vi.fn(() => Promise.resolve({ data: { _id: '1', content: 'Test message' } })),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('CommunityChat', () => {
  test('renders community chat component', async () => {
    render(
      <BrowserRouter>
        <CommunityChat />
      </BrowserRouter>
    );

    // Check for the main heading
    expect(screen.getByText('Community Support')).toBeInTheDocument();
  });

  test('renders create new group button', () => {
    render(
      <BrowserRouter>
        <CommunityChat />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /new group/i })).toBeInTheDocument();
  });
});
