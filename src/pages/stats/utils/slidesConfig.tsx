import { Rate, Space, Tag, Typography } from 'antd';

import { type Product } from '../../../entities/product/model/types';

export type StatSlide = {
  key: string;
  products: Product[];
  title: React.ReactNode;
  tag?: React.ReactNode;
  sortBy: 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  emptyText: string;
  renderDescription?: (product: Product) => React.ReactNode;
};

export const genereteSlidesConfig = (
  highPriceProducts: Product[],
  lowPriceProducts: Product[],
  topRatingProducts: Product[],
  bottomRatingProducts: Product[]
) => {
  return {
    highPrice: {
      key: 'highPrice',
      products: highPriceProducts,
      title: 'Дорогие позиции',
      tag: <Tag color="volcano">цена выше 1000</Tag>,
      sortBy: 'price',
      sortOrder: 'desc',
      emptyText: 'Нет товаров дороже 1000',
    },
    lowPrice: {
      key: 'lowPrice',
      products: lowPriceProducts,
      title: 'Бюджетные позиции',
      tag: <Tag color="cyan">цена ниже 100</Tag>,
      sortBy: 'price',
      sortOrder: 'asc',
      emptyText: 'Нет товаров дешевле 100',
    },
    bottomRating: {
      key: 'bottomRating',
      products: bottomRatingProducts,
      title: 'Низкий рейтинг',
      tag: <Tag color="default">рейтинг ниже 3.5</Tag>,
      sortBy: 'rating',
      sortOrder: 'asc',
      emptyText: 'Нет товаров с рейтингом ниже 3.5',
    },
    topRating: {
      key: 'topRating',
      products: topRatingProducts,
      title: 'Высокий рейтинг',
      tag: <Tag color="gold">рейтинг выше 4.5</Tag>,
      sortBy: 'rating',
      sortOrder: 'desc',
      emptyText: 'Нет товаров с рейтингом выше 4.5',
    },
  } as const;
};
