import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { BrowserRouter } from 'react-router-dom';

describe('NotFound', () => {
  test('renders 404 page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
  });

  test('shows page not found message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  test('shows home link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
