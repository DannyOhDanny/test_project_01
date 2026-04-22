import { useQuery } from '@tanstack/react-query';

import { productKeys } from '../productKeys';

import { productApi } from './productApi';

export const useProductPageQuery = (params: {
  isAuthenticated: boolean;
  listFromTextSearch: boolean;
  selectedId: string | null;
  pageSize: number;
  pageSkip: number;
  sortBy?: string | undefined;
  order?: 'asc' | 'desc' | undefined;
}) => {
  return useQuery({
    queryKey: productKeys.paginated({
      limit: params.pageSize,
      skip: params.pageSkip,
      sortBy: params.sortBy,
      order: params.order,
    }),
    queryFn: async () => {
      const { data } = await productApi.getProductsByPage(
        params.pageSize,
        params.pageSkip,
        params.sortBy,
        params.order
      );
      return data;
    },
    enabled: params.isAuthenticated && !params.listFromTextSearch && params.selectedId === null,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};
