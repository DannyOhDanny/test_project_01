import React, { useCallback, useMemo, useState } from 'react';
import { Flex } from 'antd';

import { usePorductAllQuery } from '../../entities/product/api/usePorductAllQuery';
import { usePorductPageQuery } from '../../entities/product/api/usePorductPageQuery';
import type { Product } from '../../entities/product/model/types';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import { RatingsCard } from '../../shared/ui/RatingsCard/RatingsCard';

import type { ProductStatistics } from './model/types';
import { columns } from './utils/columnsConfig';
import { computeProductStatistics } from './utils/functions';
import { options } from './utils/optionsConfig';
import { genereteSlidesConfig } from './utils/slidesConfig';

const StatisticsPage: React.FC = () => {
  const limitPerSlide = 5;
  const [selectedStat, setSelectedStat] = useState<string>('highPrice');

  const isAuthenticatedAuth = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticatedUser = useUserStore((s) => s.isAuthenticated);
  const isSessionAuthenticated = isAuthenticatedAuth || isAuthenticatedUser;

  const productsPageQuery = usePorductPageQuery({
    isAuthenticated: isSessionAuthenticated,
    listFromTextSearch: false,
    selectedId: null,
    pageSize: 1,
    pageSkip: 0,
    sortBy: undefined,
    order: undefined,
  });

  const total = productsPageQuery.data?.total ?? 0;
  const allProductsQuery = usePorductAllQuery({
    total,
    enabled: isSessionAuthenticated && productsPageQuery.isSuccess,
    isAuthenticated: isSessionAuthenticated,
  });

  const productStatistics = useMemo((): ProductStatistics | null => {
    const list = allProductsQuery.data;
    if (!list?.length) return null;
    return computeProductStatistics(list);
  }, [allProductsQuery.data]);

  const productStatisticsSlides = useMemo(() => {
    if (!productStatistics) return [];
    const { highPriceProducts, lowPriceProducts, topRatingProducts, bottomRatingProducts } =
      productStatistics;

    const slides = genereteSlidesConfig(
      highPriceProducts,
      lowPriceProducts,
      topRatingProducts,
      bottomRatingProducts
    );
    return Object.values(slides).filter((s) => s.products.length > 0);
  }, [productStatistics]);

  const currentSlide = useMemo(() => {
    const slide = productStatisticsSlides.find((s) => s.key === selectedStat)?.products;
    if (!slide) return [];
    slide.sort((a: Product, b: Product) =>
      selectedStat === 'highPrice' ? b.price - a.price : b.rating - a.rating
    );
    return slide.slice(0, limitPerSlide) ?? (undefined as unknown as Product[]);
  }, [productStatisticsSlides, selectedStat, limitPerSlide]);

  const handleSelectStat = useCallback(
    (value: string) => {
      void setSelectedStat(value);
    },
    [setSelectedStat]
  );

  const activeSlideMeta = useMemo(() => {
    const found = productStatisticsSlides.find((s) => s.key === selectedStat);
    return found ?? productStatisticsSlides[0] ?? null;
  }, [productStatisticsSlides, selectedStat]);

  return (
    <Flex vertical style={{ width: '50%', gap: 12 }}>
      <RatingsCard
        data={currentSlide}
        columns={columns}
        options={options}
        title={activeSlideMeta?.title}
        tag={activeSlideMeta?.tag}
        emptyText={activeSlideMeta?.emptyText ?? 'Нет данных'}
        selectedStat={selectedStat}
        onSelectStat={handleSelectStat}
        loading={allProductsQuery.isFetching || productsPageQuery.isFetching}
        countText={`${currentSlide?.length ?? 0} поз.`}
      />
    </Flex>
  );
};
export { StatisticsPage };
