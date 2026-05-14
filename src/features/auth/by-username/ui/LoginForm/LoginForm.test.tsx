import { MemoryRouter, Route, Routes } from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const { loginMock, mockUseAuthStore } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  mockUseAuthStore: vi.fn(),
}));

vi.mock('../../../../../entities/user/model/authStore', () => ({
  useAuthStore: mockUseAuthStore,
}));

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  beforeEach(() => {
    loginMock.mockReset();
    mockUseAuthStore.mockReset();
    loginMock.mockResolvedValue(undefined);
    mockUseAuthStore.mockReturnValue({
      login: loginMock,
      isLoading: false,
      error: null,
    });
  });
  const renderForm = () =>
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LoginForm themeMode="light" onSuccess={() => {}} />} />
        </Routes>
      </MemoryRouter>
    );

  it('рендерит форму логина', () => {
    renderForm();
    expect(screen.getByText('Добро пожаловать')).toBeDefined();
    expect(screen.getByPlaceholderText('Введите логин')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите пароль')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Запомнить данные' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument();
  });

  it('показывает ошибки валидации для пустой формы', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getByText('Введите логин')).toBeInTheDocument();
      expect(screen.getByText('Введите пароль')).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });
  it('показывает ошибку, если логин пустой', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите логин'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getByText('Введите логин')).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });
  it('показывает ошибку, если пароль пустой', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getByText('Введите пароль')).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('показывает ошибку, если логин содержит недопустимые символы', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: '12334567' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getByText('Латинские буквы')).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });
  it('показывает ошибку, если пароль содержит недопустимые символы', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: '12334567' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getByText('Латинские буквы')).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });
  it('показывает ошибку, если логин и пароль содержат недопустимые символы', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: '12334567' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: '12334567' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(screen.getAllByText('Латинские буквы')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Латинские буквы')[1]).toBeInTheDocument();
    });
    expect(loginMock).not.toHaveBeenCalled();
  });
  it('показывает вызов loginMock если логин и пароль содержат допустимые символы', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: 'emilys' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: 'emilyspass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ username: 'emilys', password: 'emilyspass' }, false);
    });
  });
});
