import { useQuery } from '@tanstack/react-query';

import { productKeys } from '../productKeys';

import { productApi } from './productApi';

const useProductByCategoryQuery = (category: string) => {
  return useQuery({
    queryKey: productKeys.byCategory({ category }),
    queryFn: async () => {
      if (!category) return null;
      const data = await productApi.getProductByCategory(category);
      return data;
    },
    enabled: !!category,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};

export { useProductByCategoryQuery };
