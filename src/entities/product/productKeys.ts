export const productKeys = {
  all: () => ['products'] as const,
  catalogAll: (total: number) => [...productKeys.all(), 'catalog-all', total] as const,
  paginated: (params: { limit: number; skip: number; sortBy?: string; order?: string }) =>
    [
      ...productKeys.all(),
      'paginated',
      params.limit,
      params.skip,
      params.sortBy ?? '',
      params.order ?? '',
    ] as const,
  search: (params: { query: string }) =>
    [...productKeys.all(), 'search', params.query.trim().toLowerCase()] as const,
  byId: (id: string) => ['product', id] as const,
  byCategory: (params: { category: string }) =>
    [...productKeys.all(), 'category', params.category] as const,
};
