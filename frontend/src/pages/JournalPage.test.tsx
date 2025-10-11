import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JournalPage from './JournalPage';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('JournalPage', () => {
  test('renders journal page', () => {
    render(
      <BrowserRouter>
        <JournalPage />
      </BrowserRouter>
    );

    // Journal page should render without crashing
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
