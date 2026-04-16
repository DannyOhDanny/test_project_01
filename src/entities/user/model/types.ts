export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  age?: number;
  phone?: string;
  birthDate?: string;
  address?: {
    city: string;
    address: string;
  };
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  updated: boolean;
  updatedError: string | null;
  updatedLoading: boolean;
}

export interface UserActions {
  updateUser: (
    id: string,
    data: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'gender' | 'age'>
  ) => Promise<void>;
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
  checkAuth: () => Promise<boolean>;
}
