import { create } from 'zustand';

import { authApi } from '../../../features/auth/by-username/api/authApi.ts';
import type { AppThemeMode } from '../../../shared/config/themeMode';
import { authUtils } from '../../../shared/lib/authConfig';
import { tokenStorage } from '../../../shared/lib/tokenStorage';

import { userApi } from './api/userApi';
import { UserActions, UserState } from './types';
type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  updated: false,
  updatedError: null,
  updatedLoading: false,
  themeMode: (localStorage.getItem('themeMode') as AppThemeMode) || ('light' as AppThemeMode),
  setThemeMode: (themeMode: AppThemeMode) => {
    localStorage.setItem('themeMode', themeMode);
    set({ themeMode });
    return themeMode;
  },
  getThemeMode: () => {
    const themeMode = (localStorage.getItem('themeMode') as AppThemeMode)
      ? (localStorage.getItem('themeMode') as AppThemeMode)
      : ('light' as AppThemeMode);
    set({ themeMode });
    return themeMode;
  },
  updateUser: async (id, data) => {
    set({
      updatedLoading: true,
      updatedError: null,
      updated: false,
      themeMode: get().getThemeMode(),
    });
    try {
      const { data: updatedUser } = await userApi.patchUser(id, data);
      set({
        user: updatedUser,
        updated: true,
        updatedLoading: false,
        updatedError: null,
        themeMode: get().getThemeMode(),
      });
    } catch (err) {
      const message =
        err &&
        typeof err === 'object' &&
        'userMessage' in err &&
        typeof (err as { userMessage: unknown }).userMessage === 'string'
          ? (err as { userMessage: string }).userMessage
          : err instanceof Error
            ? err.message
            : 'Не удалось обновить профиль';
      set({
        updated: false,
        updatedLoading: false,
        updatedError: message,
        themeMode: get().getThemeMode(),
      });
    }
  },

  setUser: (user) => set({ user, themeMode: get().getThemeMode() }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      updated: false,
      updatedError: null,
      updatedLoading: false,
      themeMode: get().getThemeMode(),
    });
    tokenStorage.clearTokens();
  },

  checkAuth: async () => {
    const remember = authUtils.getRememberMe();
    const { accessToken, refreshToken } = tokenStorage.getTokens(remember);

    if (!accessToken) {
      return false;
    }

    if (authUtils.isTokenExpired(accessToken) && refreshToken) {
      try {
        const response = await authApi.refresh(refreshToken);
        tokenStorage.setTokens(response.accessToken, response.refreshToken, remember);

        const user = await authApi.getCurrentUser(response.accessToken);
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } catch {
        get().clearUser();
        return false;
      }
    } else if (!authUtils.isTokenExpired(accessToken)) {
      try {
        const user = await authApi.getCurrentUser(accessToken);
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } catch {
        get().clearUser();
        return false;
      }
    }

    return false;
  },
}));
