export interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenStorage = {
  setTokens: (accessToken: string, refreshToken: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
  },

  getTokens: (remember: boolean): TokenStorage => {
    const storage = remember ? localStorage : sessionStorage;
    return {
      accessToken: storage.getItem('accessToken'),
      refreshToken: storage.getItem('refreshToken'),
    };
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },
};
