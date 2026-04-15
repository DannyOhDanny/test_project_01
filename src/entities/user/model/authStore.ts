import axios from 'axios';
import { create } from 'zustand';

import { authApi } from '../../../features/auth/by-username/api/authApi';
import { LoginCredentials } from '../../../features/auth/by-username/model/types';
import { authUtils } from '../../../shared/lib/authConfig';
import { tokenStorage } from '../../../shared/lib/tokenStorage';

import { useUserStore } from './userStore';
interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, remember: boolean) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials, remember: boolean) => {
    set({ isLoading: true, error: null, isAuthenticated: false });

    try {
      const response = await authApi.login(credentials);

      tokenStorage.setTokens(response.accessToken, response.refreshToken, remember);
      authUtils.setRememberMe(remember);

      const userStore = useUserStore.getState();
      userStore.setUser(response.user);
      userStore.setAuthenticated(true);
      set({ isAuthenticated: true });

      set({ isLoading: false });
    } catch (error) {
      let errorMessage = 'Введенные данные неверны. Попробуйте еще раз';
      set({ isAuthenticated: false });

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    const userStore = useUserStore.getState();
    userStore.clearUser();
    set({ error: null, isLoading: false, isAuthenticated: false });
  },
}));
