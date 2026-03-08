import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JournalList } from './JournalList';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ 
      data: [
        {
          _id: '1',
          title: 'My First Entry',
          content: 'Today was a good day',
          createdAt: new Date().toISOString(),
          mood: 'happy',
        },
      ]
    })),
  },
}));

describe('JournalList', () => {
  test('renders journal list', () => {
    const { container } = render(
      <JournalList />
    );

    expect(container).toBeInTheDocument();
  });
});
