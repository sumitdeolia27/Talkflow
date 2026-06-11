import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).not.toBeNull();
  });

  it('applies the height prop correctly', () => {
    const { container } = render(<Loading height="50vh" />);
    expect(container.firstChild.style.height).toBe('50vh');
  });
});
