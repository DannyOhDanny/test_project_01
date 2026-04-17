import type { Product } from '../../../entities/product/model/types';
export type ProductStatistics = {
  topRatingProducts: Product[];
  bottomRatingProducts: Product[];
  highPriceProducts: Product[];
  lowPriceProducts: Product[];
};
export type PieDatum = {
  categoryName: string;
  categoryCount: number;
  percent: number;
};
