import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// `vi.hoisted` нужен, потому что Vitest поднимает `vi.mock(...)` наверх файла.
const { checkAuthMock, mockUseUserStore } = vi.hoisted(() => ({
  checkAuthMock: vi.fn(),
  mockUseUserStore: vi.fn(),
}));

// Убираем реальный QueryProvider из теста.
vi.mock('./provider/QueryProvider', () => ({
  QueryProvider: ({ children }: { children: ReactNode }) => children,
}));

// Мокаем user store, чтобы вручную управлять авторизацией:
vi.mock('../entities/user/model/userStore', () => ({
  useUserStore: mockUseUserStore,
}));

// ErrorBoundary и layout упрощаем до "прозрачных" оберток.
vi.mock('../shared/ui/ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('../widgets/Layout/AppLayout/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => children,
}));

// Ленивые страницы (`lazy(...)`) подменяем простыми заглушками.
vi.mock('../pages/auth/LoginPage/ui/LoginPage', () => ({
  LoginPage: () => <div>Login Page</div>,
}));
vi.mock('../pages/table/TablePage', () => ({
  TablePage: () => <div>Table Page</div>,
}));
vi.mock('../pages/profile/ProfilePage/ui/ProfilePage', () => ({
  ProfilePage: () => <div>Profile Page</div>,
}));
vi.mock('../pages/stats/StatisticsPage', () => ({
  StatisticsPage: () => <div>Stats Page</div>,
}));
vi.mock('../pages/calc/CalcPage', () => ({
  CalcPage: () => <div>Calc Page</div>,
}));
vi.mock('../pages/not-found/NotFoundPage', () => ({
  NotFoundPage: () => <div>Not Found Page</div>,
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    // Перед каждым тестом очищаем историю вызовов и возвращаем дефолтный сценарий:
    checkAuthMock.mockReset();
    mockUseUserStore.mockReset();
    // Пользователь авторизирован, проверка авторизации завершается успешно.
    checkAuthMock.mockResolvedValue(true);
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock,
    });
  });

  const renderAt = (path: string) => {
    // Важно: App уже содержит внутри себя `BrowserRouter`.
    // Поэтому здесь не нужен внешний `MemoryRouter`.
    // Чтобы протестировать конкретный маршрут, достаточно поменять URL браузера
    // и затем отрендерить сам App.
    window.history.pushState({}, 'Test page', path);
    return render(<App />);
  };

  it('редирект на Table Page, если пользователь авторизован', async () => {
    // Поэтому мы открываем корень
    renderAt('/');
    // ждем
    await waitFor(() => {
      expect(screen.getAllByText('Table Page')[0]).toBeInTheDocument();
    });
  });

  it('редирект на Login Page, если пользователь не авторизован', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: false,
      checkAuth: checkAuthMock.mockResolvedValue(false),
    });

    renderAt('/');

    await waitFor(() => {
      expect(screen.getAllByText('Login Page')[0]).toBeInTheDocument();
    });
  });

  it('редирект на Login Page, если пользователь не авторизован и пытается попасть на страницу login', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: false,
      checkAuth: checkAuthMock.mockResolvedValue(false),
    });

    renderAt('/login');

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('редирект на Profile Page, если пользователь авторизован', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock.mockResolvedValue(true),
    });

    renderAt('/profile');

    await waitFor(() => {
      expect(screen.getAllByText('Profile Page')[0]).toBeInTheDocument();
    });
  });

  it('редирект на Stats Page, если пользователь авторизован', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock.mockResolvedValue(true),
    });

    renderAt('/stats');

    await waitFor(() => {
      expect(screen.getAllByText('Stats Page')[0]).toBeInTheDocument();
    });
  });

  it('редирект на Calc Page, если пользователь авторизован', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock.mockResolvedValue(true),
    });

    renderAt('/calc');

    await waitFor(() => {
      expect(screen.getAllByText('Calc Page')[0]).toBeInTheDocument();
    });
  });

  it('редирект на Not Found Page, если пользователь не авторизован и нет такой страницы', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: false,
      checkAuth: checkAuthMock.mockResolvedValue(false),
    });

    renderAt('/unknown-route');

    await waitFor(() => {
      expect(screen.getAllByText('Not Found Page')[0]).toBeInTheDocument();
    });
  });
});
