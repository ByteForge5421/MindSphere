import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MoodChart from './MoodChart';

// Mock chart library if needed
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

describe('MoodChart', () => {
  test('renders mood chart component', () => {
    const mockData = [
      { date: '2024-01-01', mood: 5 },
      { date: '2024-01-02', mood: 6 },
    ];

    const { container } = render(
      <MoodChart data={mockData} />
    );

    expect(container).toBeInTheDocument();
  });

  test('renders with empty data', () => {
    const { container } = render(
      <MoodChart data={[]} />
    );

    expect(container).toBeInTheDocument();
  });
});
