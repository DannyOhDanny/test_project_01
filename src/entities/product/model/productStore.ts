import { create } from 'zustand';
import { ProductsState, ProductActions } from './types';
import { productApi } from '../api/productApi';

type ProductStore = ProductsState & ProductActions;

let progressTimer: number | null = null;

export const useProductStore = create<ProductStore>((set, get) => ({
  products: null,
  searchProduct: null,
  isLoading: false,
  error: null,
  progress: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getProducts: async () => {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }

    set({ isLoading: true, error: null, progress: 0 });

    progressTimer = window.setInterval(() => {
      const currentProgress = get().progress;

      if (currentProgress < 95) {
        const increment = Math.random() * 2 + 0.5;
        const newProgress = Math.min(currentProgress + increment, 95);

        set({ progress: newProgress });
      }
    }, 160);

    try {
      const response = await productApi.getAll((progressEvent) => {
        if (progressEvent.total) {
          if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
          }
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          set({ progress: percent });
        }
      });

      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }

      set({ progress: 100 });
      setTimeout(() => {
        set({
          products: response.data,
          isLoading: false,
          error: null,
          progress: 0,
          searchProduct: null,
        });
      }, 2000);
    } catch (error: any) {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка загрузки товаров';
      set({ isLoading: false, error: errorMessage, progress: 0, searchProduct: null });
    }
  },

  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getById(id);
      set({
        searchProduct: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка загрузки товара';
      set({ isLoading: false, error: errorMessage });
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null, searchProduct: null });
    try {
      const response = await productApi.search(query);
      set({
        products: response.data,
        isLoading: false,
        error: null,
        searchProduct: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка поиска товаров';
      set({ isLoading: false, error: errorMessage });
    }
  },
}));
