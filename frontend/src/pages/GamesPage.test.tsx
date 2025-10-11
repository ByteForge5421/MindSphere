import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GamesPage from './GamesPage';

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

describe('GamesPage', () => {
  test('renders games page', () => {
    render(
      <BrowserRouter>
        <GamesPage />
      </BrowserRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
