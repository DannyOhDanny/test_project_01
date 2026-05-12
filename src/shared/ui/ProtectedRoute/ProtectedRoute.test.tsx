import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProtectedRoute } from './ProtectedRoute';

const { checkAuthMock, mockUseUserStore } = vi.hoisted(() => ({
  checkAuthMock: vi.fn(),
  mockUseUserStore: vi.fn(),
}));

vi.mock('../../../entities/user/model/userStore', () => ({
  useUserStore: mockUseUserStore,
}));

describe('ProtectedRoute', () => {
  const renderWithRouter = (ui: ReactNode, initialPath = '/profile') =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/profile" element={ui} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/custom-login" element={<div>Custom Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    checkAuthMock.mockReset();
    mockUseUserStore.mockReset();

    checkAuthMock.mockResolvedValue(true);
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock,
    });
  });

  it('рендерит spinner, если происходит проверка авторизации', () => {
    checkAuthMock.mockImplementation(() => new Promise(() => {}));
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByRole('img', { name: 'loading' })).toBeInTheDocument();
  });

  it('вызывает checkAuth при маунте', () => {
    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(checkAuthMock).toHaveBeenCalledTimes(1);
  });

  it('рендерит children после успешной проверки авторизации', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      checkAuth: checkAuthMock,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('перенаправляет на /login, если пользователь не авторизован', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: false,
      checkAuth: checkAuthMock,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('перенаправляет на кастомный путь, если передан redirectTo', async () => {
    mockUseUserStore.mockReturnValue({
      isAuthenticated: false,
      checkAuth: checkAuthMock,
    });

    renderWithRouter(
      <ProtectedRoute redirectTo="/custom-login">
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Custom Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
