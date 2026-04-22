import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../user/model/authStore';
import type { Products } from '../model/types';
import { productKeys } from '../productKeys';

import { productApi } from './productApi';

type UseProductAllQueryOptions = {
  total?: number;
  enabled?: boolean;
  isAuthenticated?: boolean;
};

export const useProductAllQuery = (options?: UseProductAllQueryOptions) => {
  const isAuthenticatedFromStore = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticated = options?.isAuthenticated ?? isAuthenticatedFromStore;
  const total = options?.total ?? 0;

  return useQuery({
    enabled: (options?.enabled ?? true) && isAuthenticated && total > 0,
    queryKey: productKeys.catalogAll(total),
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('Unauthorized');
      }
      const data: Products = await productApi.getAllProducts(total);
      return data.products ?? [];
    },
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};
