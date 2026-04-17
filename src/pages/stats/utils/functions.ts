import type { Product } from '../../../entities/product/model/types';
import type { ProductStatistics } from '../model/types';

export function computeProductStatistics(products: Product[]): ProductStatistics {
  return products.reduce<ProductStatistics>(
    (acc, product) => {
      if (product.rating > 4.5) {
        acc.topRatingProducts.push(product);
      } else if (product.rating < 3.5) {
        acc.bottomRatingProducts.push(product);
      }
      if (product.price > 1000) {
        acc.highPriceProducts.push(product);
      } else if (product.price < 100) {
        acc.lowPriceProducts.push(product);
      }
      return acc;
    },
    {
      topRatingProducts: [],
      bottomRatingProducts: [],
      highPriceProducts: [],
      lowPriceProducts: [],
    }
  );
}
