import type { Product } from '../../../../entities/product/model/types';
import type { RatingsCardSortBy, RatingsCardSortOrder } from '../model/types';

export function sortProducts(
  products: Product[],
  sortBy: RatingsCardSortBy,
  sortOrder: RatingsCardSortOrder
): Product[] {
  return [...products].sort((a, b) => {
    const va = sortBy === 'price' ? a.price : a.rating;
    const vb = sortBy === 'price' ? b.price : b.rating;
    return sortOrder === 'desc' ? vb - va : va - vb;
  });
}
