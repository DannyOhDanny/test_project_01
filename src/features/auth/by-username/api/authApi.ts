import { axiosInstance } from '../../../../shared/api/axiosConfig';
import { API_CONFIG } from '../../../../shared/config/api.config';
import { AuthResponse, LoginCredentials, RefreshResponse } from '../model/types';

const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || API_CONFIG.DEFAULT_EXPIRES_IN,
    });
    return response.data;
  },

  getCurrentUser: async (accessToken: string): Promise<AuthResponse['user']> => {
    const response = await axiosInstance.get<AuthResponse['user']>(API_CONFIG.ENDPOINTS.ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await axiosInstance.post<RefreshResponse>(API_CONFIG.ENDPOINTS.REFRESH, {
      refreshToken,
    });
    return response.data;
  },
};

export { authApi };
