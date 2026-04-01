import { create } from 'zustand';

import { productApi } from '../api/productApi';

import { Product, ProductActions, ProductsState } from './types';

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
  addProduct: (newProduct: Partial<Product>) => {
    const currentProducts = get().products?.products || [];

    const productWithDefaults: Product = {
      id: newProduct.id || Date.now(),
      title: newProduct.title || 'Без названия',
      brand: newProduct.brand || '',
      rating: newProduct.rating || 0,
      category: newProduct.category || '',
      sku: newProduct.sku || '11111',
      price: newProduct.price || 0,
      description: newProduct.description || '',
      discountPercentage: newProduct.discountPercentage || 0,
      stock: newProduct.stock || 0,
      tags: newProduct.tags || [],
      weight: newProduct.weight || 0,
      dimensions: newProduct.dimensions || { width: 0, height: 0, depth: 0 },
      warrantyInformation: newProduct.warrantyInformation || '',
      shippingInformation: newProduct.shippingInformation || '',
      availabilityStatus: newProduct.availabilityStatus || 'unknown',
      reviews: newProduct.reviews || [],
      returnPolicy: newProduct.returnPolicy || '',
      minimumOrderQuantity: newProduct.minimumOrderQuantity || 1,
      meta: newProduct.meta || { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
      thumbnail:
        newProduct.thumbnail ||
        'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp',
      images: newProduct.images || [],
    };

    set({
      products: {
        products: [productWithDefaults, ...currentProducts],
        total: (get().products?.total || 0) + 1,
        skip: get().products?.skip ?? 0, // если нет, то 0
        limit: get().products?.limit ?? 10, // дефолт 10
      },
    });
  },
}));
