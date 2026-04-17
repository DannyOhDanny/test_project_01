import { useQuery } from '@tanstack/react-query';

import type { Products } from '../model/types';
import { productKeys } from '../productKeys';

import { productApi } from './productApi';

export const usePorductAllQuery = (params: { total: number; enabled?: boolean }) => {
  const enabled = (params.enabled ?? true) && params.total > 0;

  return useQuery({
    queryKey: productKeys.catalogAll(params.total),
    queryFn: async () => {
      const data: Products = await productApi.getAllProducts(params.total);
      return data.products ?? [];
    },
    enabled,
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};
