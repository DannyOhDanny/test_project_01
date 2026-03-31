import { create } from 'zustand';
import {
  UserState,
  UserActions,
  //User
} from './types';
import { authApi } from '../../../features/auth/by-username/api/authApi.ts';
import { tokenStorage } from '../../../shared/lib/tokenStorage';
import { authUtils } from '../../../shared/lib/authConfig';

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
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
