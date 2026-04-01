import { AxiosProgressEvent } from 'axios';

import { axiosProductInstance } from '../../../shared/api/axiosConfig';
import { PRODUCT_API_CONFIG } from '../../../shared/config/api.config';
import { Product, Products } from '../model/types';

export const productApi = {
  getAll: (onProgress?: (progressEvent: AxiosProgressEvent) => void) =>
    axiosProductInstance.get<Products>(`${PRODUCT_API_CONFIG.BASE_URL}?limit=120`, {
      onDownloadProgress: onProgress,
    }),
  getById: (id: string) =>
    axiosProductInstance.get<Product>(`${PRODUCT_API_CONFIG.BASE_URL}/${id}`),
  search: (query: string) =>
    axiosProductInstance.get<Products>(
      `${PRODUCT_API_CONFIG.BASE_URL}/search?q=${encodeURIComponent(query)}`
    ),
};
