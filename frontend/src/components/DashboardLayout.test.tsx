import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayout from './DashboardLayout';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
    },
    logout: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('DashboardLayout', () => {
  test('renders layout with sidebar and main content', () => {
    const mockChild = <div>Dashboard Content</div>;
    
    const { container } = render(
      <BrowserRouter>
        <DashboardLayout>{mockChild}</DashboardLayout>
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    // Check for common dashboard navigation items
    expect(screen.queryByRole('navigation')).toBeTruthy();
  });
});
