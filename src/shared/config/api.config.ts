export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com/auth',
  ENDPOINTS: {
    LOGIN: '/login',
    ME: '/me',
    REFRESH: '/refresh',
  },
  DEFAULT_EXPIRES_IN: 60,
} as const;

export const PRODUCT_API_CONFIG = {
  BASE_URL: 'https://dummyjson.com/product',
} as const;
