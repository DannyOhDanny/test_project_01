import { useQuery } from '@tanstack/react-query';

import { productKeys } from '../productKeys';

import { productApi } from './productApi';

export const useProductSearchQuery = (params: {
  isAuthenticated: boolean;
  listFromTextSearch: boolean;
  query: string;
}) => {
  return useQuery({
    queryKey: productKeys.search({ query: params.query }),
    queryFn: async () => {
      if (!params.query) return null;
      const { data } = await productApi.search(params.query);
      return data;
    },
    enabled: params.isAuthenticated && params.listFromTextSearch && params.query.length > 0,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};
