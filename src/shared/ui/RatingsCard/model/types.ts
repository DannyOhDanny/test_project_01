import type { ReactNode } from 'react';

import type { Product } from '../../../../entities/product/model/types';

export type RatingsCardProps = {
  data: Product[];
  title: ReactNode;
  tag?: ReactNode;
  sortBy: 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  emptyText: string;
  renderDescription?: (product: Product) => ReactNode;
};
