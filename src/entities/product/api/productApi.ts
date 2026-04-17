import { AxiosProgressEvent } from 'axios';

import { axiosProductInstance } from '../../../shared/api/axiosConfig';
import { PRODUCT_API_CONFIG } from '../../../shared/config/api.config';
import { Product, Products } from '../model/types';

export const productApi = {
  getAll: (onProgress?: (progressEvent: AxiosProgressEvent) => void) =>
    axiosProductInstance.get<Products>(`${PRODUCT_API_CONFIG.BASE_URL}`, {
      onDownloadProgress: onProgress,
    }),
  getAllProducts: async (total: number): Promise<Products> => {
    try {
      return axiosProductInstance
        .get<Products>(`${PRODUCT_API_CONFIG.BASE_URL}?limit=${total}&skip=0`)
        .then((response) => response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      throw new Error('Error fetching products');
    }
  },
  /** Постраничная выборка; на странице `/table` вызывается через TanStack Query (useQuery), а не напрямую из компонента. */
  getProductsByPage: (
    limit: number,
    skip: number,
    sortBy?: string | undefined,
    order?: 'asc' | 'desc' | undefined,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    let url = `${PRODUCT_API_CONFIG.BASE_URL}?limit=${limit}&skip=${skip}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
    }
    return axiosProductInstance.get<Products>(url, { onDownloadProgress: onProgress });
  },
  getById: (id: string) =>
    axiosProductInstance.get<Product>(`${PRODUCT_API_CONFIG.BASE_URL}/${id}`),
  search: (query: string) =>
    axiosProductInstance.get<Products>(
      `${PRODUCT_API_CONFIG.BASE_URL}/search?q=${encodeURIComponent(query)}`
    ),
};
