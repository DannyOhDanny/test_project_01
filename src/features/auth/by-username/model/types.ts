import { User } from '../../../../entities/user/model/types';

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginFormValues {
  new_user_name: string;
  new_user_password: string;
  remember: boolean;
}
