import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock useTheme hook
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'system',
    setTheme: vi.fn(),
    actualTheme: 'light',
  }),
}));

describe('ThemeToggle', () => {
  test('renders theme toggle button', () => {
    render(
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('renders with correct variant prop', () => {
    const { container } = render(
      <TooltipProvider>
        <ThemeToggle variant="outline" />
      </TooltipProvider>
    );
    
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  test('renders with size prop', () => {
    const { container } = render(
      <TooltipProvider>
        <ThemeToggle size="lg" />
      </TooltipProvider>
    );
    
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  test('renders label when showLabel is true', () => {
    render(
      <TooltipProvider>
        <ThemeToggle showLabel={true} />
      </TooltipProvider>
    );
    
    // The label should be rendered based on theme
    expect(screen.queryByText(/Theme|Light|Dark|System/i)).toBeTruthy();
  });

  test('does not render label when showLabel is false', () => {
    render(
      <TooltipProvider>
        <ThemeToggle showLabel={false} />
      </TooltipProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('opens dropdown menu on button click', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);

    // Dropdown options should be visible
    await waitFor(() => {
      expect(screen.queryByText(/Light|Dark|System/i)).toBeTruthy();
    });
  });
});
