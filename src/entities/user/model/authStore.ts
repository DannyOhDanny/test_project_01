import { create } from 'zustand';
import { authApi } from '../../../features/auth/by-username/api/authApi';
import { LoginCredentials } from '../../../features/auth/by-username/model/types';
import { tokenStorage } from '../../../shared/lib/tokenStorage';
import { useUserStore } from './userStore';
import { authUtils } from '../../../shared/lib/authConfig';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, remember: boolean) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials, remember: boolean) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login(credentials);

      tokenStorage.setTokens(response.accessToken, response.refreshToken, remember);
      authUtils.setRememberMe(remember);

      const userStore = useUserStore.getState();
      userStore.setUser(response.user);
      userStore.setAuthenticated(true);

      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Введенные даннные неверны. Попробуйте еще раз';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    const userStore = useUserStore.getState();
    userStore.clearUser();
    set({ error: null, isLoading: false });
  },
}));
