import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeedlingIcon, LeafIcon, FlowerIcon, TreeIcon } from './PlantIcons';

describe('PlantIcons', () => {
  test('renders seedling icon', () => {
    render(<SeedlingIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('renders leaf icon', () => {
    render(<LeafIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('renders flower icon', () => {
    render(<FlowerIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('renders tree icon', () => {
    render(<TreeIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
