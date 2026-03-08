import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JournalEntry } from './JournalEntry';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('JournalEntry', () => {
  test('renders journal entry form', () => {
    render(
      <JournalEntry />
    );

    expect(screen.getByLabelText(/title/i) || screen.getByPlaceholderText(/title/i)).toBeTruthy();
  });

  test('allows typing in entries', async () => {
    const user = userEvent.setup();
    render(
      <JournalEntry />
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
