import { useQuery } from '@tanstack/react-query';

import { productKeys } from '../productKeys';

import { productApi } from './productApi';

export const useProductByIdQuery = (params: {
  isAuthenticated: boolean;
  selectedId: string | null;
  listFromTextSearch: boolean;
}) => {
  return useQuery({
    queryKey: productKeys.byId(params.selectedId ?? ''),
    queryFn: async () => {
      if (!params.selectedId) return null;
      const { data } = await productApi.getById(params.selectedId ?? '');
      return data;
    },
    enabled: params.isAuthenticated && params.selectedId !== null && !params.listFromTextSearch,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};
