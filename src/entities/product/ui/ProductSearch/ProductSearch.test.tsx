import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductSearch } from './ProductSearch';

describe('ProductSearch', () => {
  it('рендерится с placeholder', () => {
    render(<ProductSearch onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText('Найти')).toBeInTheDocument();
  });

  it('вызывает onSearch при вводе и нажатии Enter', () => {
    const onSearchMock = vi.fn();

    render(<ProductSearch onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText('Найти');

    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledWith('apple', expect.anything());
  });

  it('имеет иконку поиска', () => {
    render(<ProductSearch onSearch={vi.fn()} />);

    const icon = screen.getByRole('img', { hidden: true });

    expect(icon).toBeInTheDocument();
  });

  it('input имеет name search-fn', () => {
    render(<ProductSearch onSearch={vi.fn()} />);

    const input = screen.getByRole('searchbox');

    expect(input).toHaveAttribute('name', 'search-fn');
  });
});
