import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Pie, type PieConfig } from '@ant-design/charts';
import { Card, Col, Divider, Flex, Row, Skeleton, Space, Statistic, Typography } from 'antd';

import { usePorductAllQuery } from '../../entities/product/api/usePorductAllQuery';
import { usePorductPageQuery } from '../../entities/product/api/usePorductPageQuery';
import type { Product } from '../../entities/product/model/types';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import { getCategory } from '../../shared/functions/productFunctions';

import type { ProductStatistics } from './model/types';
import { columns } from './utils/columnsConfig';
import { computeProductStatistics } from './utils/functions';
import { options } from './utils/optionsConfig';
import { genereteSlidesConfig } from './utils/slidesConfig';

const { Title, Text } = Typography;

const PIE_PALETTE = [
  '#4a5cff',
  '#5a6cff',
  '#6f7bff',
  '#8b96ff',
  '#a7b0ff',
  '#c3c9ff',
  '#242EDB',
  '#3d47e6',
  '#5c65f0',
  '#7b82f5',
];

type PieDatum = {
  categoryName: string;
  categoryCount: number;
  percent: number;
};

const RatingCardLazy = lazy(() =>
  import('../../shared/ui/RatingsCard/RatingsCard').then((module) => ({
    default: module.RatingsCard,
  }))
);

const ChartLazy = lazy(() =>
  import('../../shared/ui/CategoryChart/CategoryChart.tsx').then((module) => ({
    default: module.CategoryChart,
  }))
);

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

  const chartData = useMemo(() => {
    const counts =
      allProductsQuery.data?.reduce<Record<string, number>>((acc, product) => {
        acc[product.category] = (acc[product.category] ?? 0) + 1;
        return acc;
      }, {}) ?? {};

    return (
      Object.entries(counts).map(([categoryName, categoryCount]) => ({
        categoryName: `${
          getCategory(categoryName as string)
            .charAt(0)
            .toUpperCase() + getCategory(categoryName as string).slice(1)
        }`,
        categoryCount,
      })) ?? []
    );
  }, [allProductsQuery.data]);

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
    const sorted = [...slide].sort((a: Product, b: Product) =>
      selectedStat === 'highPrice' ? b.price - a.price : b.rating - a.rating
    );
    return sorted.slice(0, limitPerSlide);
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

  const config = {
    marginTop: 40,
    data: chartData,
    xField: 'categoryName',
    yField: 'categoryCount',
    header: {
      title: {
        text: 'Срез по категориям',
        style: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
    },
    xAxis: {
      title: false,
    },
    yAxis: {
      title: {
        text: 'Количество товаров',
      },
    },
    tooltip: {
      title: (datum: { categoryName: string }) => datum.categoryName,
      items: [
        (datum: { categoryName: string; categoryCount: number }) => ({
          name: 'Товаров',
          value: `${datum.categoryCount}`,
          color: datum.categoryCount > 5 ? '#242EDB' : '#999',
        }),
      ],
    },
  };
  const pieData = useMemo((): PieDatum[] => {
    const filtered = chartData.filter((item) => Number(item.categoryCount) > 1) ?? [];
    const sum = filtered.reduce((acc, item) => acc + Number(item.categoryCount), 0);
    if (!sum) return [];
    return filtered.map((item) => ({
      categoryName: item.categoryName,
      categoryCount: Number(item.categoryCount),
      percent: (Number(item.categoryCount) / sum) * 100,
    }));
  }, [chartData]);

  const pieConfig = useMemo((): PieConfig => {
    return {
      data: pieData,
      angleField: 'categoryCount',
      colorField: 'categoryName',
      appendPadding: [10, 120, 10, 10],
      autoFit: true,
      radius: 0.92,
      innerRadius: 0.62,
      color: PIE_PALETTE,
      style: {
        stroke: '#ffffff',
        lineWidth: 2,
        inset: 1,
      },
      interactions: [{ type: 'element-active' }],
      legend: {
        color: {
          position: 'right',
          rowPadding: 6,
          colPadding: 10,
          maxCols: 1,
          itemLabelFontSize: 12,
        },
      },
      label: {
        type: 'outer',
        content: (datum: PieDatum) => `${datum.percent.toFixed(1)}%`,
        style: { fontSize: 11, fill: 'rgba(0,0,0,0.65)' },
      },
      tooltip: {
        title: (datum: PieDatum) => datum.categoryName,
        items: [
          (datum: PieDatum) => ({
            name: 'Товаров',
            value: `${datum.categoryCount} · ${datum.percent.toFixed(2)}%`,
            color: '#4a5cff',
          }),
        ],
      },
      animate: { enter: { type: 'waveIn', duration: 800 } },
    };
  }, [pieData]);
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        padding: '24px 16px 40px',
        background: 'linear-gradient(180deg, #fafafc 0%, #ffffff 55%, #ffffff 100%)',
      }}
    >
      <Flex vertical style={{ width: '100%', maxWidth: 1200, margin: '0 auto', gap: 16 }}>
        <Flex vertical gap={6}>
          <Title level={3} style={{ margin: 0 }}>
            Статистика
          </Title>
          <Text type="secondary">
            Сводка по выбранным срезам каталога и распределение товаров по категориям.
          </Text>
        </Flex>

        <Card
          variant="borderless"
          styles={{ body: { padding: 16 } }}
          style={{
            borderRadius: 18,
            border: '1px solid rgba(5, 5, 5, 0.08)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
            background: '#ffffff',
          }}
        >
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} md={8}>
              <Statistic
                title="В каталоге (API)"
                value={total}
                loading={productsPageQuery.isFetching}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Загружено для анализа"
                value={allProductsQuery.data?.length ?? 0}
                loading={allProductsQuery.isFetching}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic title="Категорий в срезе" value={chartData.length} />
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} xl={14}>
            <Space direction="vertical" size={16} style={{ width: '100%', height: '100%' }}>
              <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
                <RatingCardLazy
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
              </Suspense>

              <Card
                variant="borderless"
                title="Распределение по категориям"
                styles={{ body: { paddingTop: 8 } }}
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(5, 5, 5, 0.08)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
                  background: '#ffffff',
                }}
              >
                <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
                  <ChartLazy config={config} />
                </Suspense>
              </Card>
            </Space>
          </Col>

          <Col flex={1} xs={0} xl={10}>
            <Card
              variant="borderless"
              title="Доля категорий"
              style={{
                borderRadius: 18,
                border: '1px solid rgba(5, 5, 5, 0.08)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
                background: '#ffffff',
              }}
            >
              <Text type="secondary">Показаны категории с количеством товаров больше 1.</Text>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ position: 'relative', width: '100%', height: 420 }}>
                <Pie {...pieConfig} style={{ width: '100%', height: 420 }} />
              </div>
            </Card>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};
export { StatisticsPage };
