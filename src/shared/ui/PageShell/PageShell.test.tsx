import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('рендерится с title, description и children', () => {
    render(
      <PageShell title="Заголовок страницы" description="Описание раздела">
        <div>Содержимое</div>
      </PageShell>
    );

    expect(screen.getByRole('heading', { name: 'Заголовок страницы' })).toBeInTheDocument();
    expect(screen.getByText('Описание раздела')).toBeInTheDocument();
    expect(screen.getByText('Содержимое')).toBeInTheDocument();
  });

  it('не рендерит вторичный текст описания без description или при пустой строке', () => {
    const { container, rerender } = render(
      <PageShell title="Только заголовок">
        <span>Контент</span>
      </PageShell>
    );

    expect(container.querySelector('.ant-typography-secondary')).not.toBeInTheDocument();

    rerender(
      <PageShell title="Только заголовок" description="">
        <span>Контент</span>
      </PageShell>
    );

    expect(container.querySelector('.ant-typography-secondary')).not.toBeInTheDocument();
  });

  it('рендерит buttonText и передает функцию onButtonClick справа от заголовка', () => {
    render(
      <PageShell title="Страница" buttonText="Кнопка действия" onButtonClick={vi.fn()}>
        <div>Тело страницы</div>
      </PageShell>
    );

    expect(screen.getByRole('button', { name: 'Кнопка действия' })).toBeInTheDocument();
  });
});
