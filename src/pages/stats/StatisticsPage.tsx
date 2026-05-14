import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pie, type PieConfig } from '@ant-design/charts';
import { TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Row, Segmented, Skeleton, Space, Statistic, Typography } from 'antd';
// --- OpenLayers (ol): импорты для карты, слоёв, геометрий и оверлея тултипа ---
import { shiftKeyOnly } from 'ol/events/condition.js'; // предикат: действие только при зажатом Shift
import Feature from 'ol/Feature.js'; // векторный объект на карте (точка + произвольные свойства)
import Point from 'ol/geom/Point.js'; // геометрия «точка» в проекции карты (EPSG:3857 после fromLonLat)
import ExtentInteraction from 'ol/interaction/Extent.js'; // рамка выделения области (draw extent)
import TileLayer from 'ol/layer/Tile.js'; // растровый тайловый слой (подложка)
import VectorLayer from 'ol/layer/Vector.js'; // векторный слой (маркеры поверх подложки)
import OlMap from 'ol/Map.js'; // экземпляр карты (рендер в DOM-элемент)
import Overlay from 'ol/Overlay.js'; // HTML-элемент, привязанный к координатам карты (тултип)
import { fromLonLat } from 'ol/proj.js'; // перевод [lon, lat] WGS84 → метры Web Mercator для View/геометрий
import OSM from 'ol/source/OSM.js'; // источник тайлов OpenStreetMap
import VectorSource from 'ol/source/Vector.js'; // хранилище векторных Feature для VectorLayer
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'; // стиль отрисовки точки (круг + обводка)
import View from 'ol/View.js'; // камера карты: центр, масштаб, вращение

import { useProductAllQuery } from '../../entities/product/api/useProductAllQuery.ts';
import { useProductPageQuery } from '../../entities/product/api/useProductPageQuery.ts';
import type { Product } from '../../entities/product/model/types';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import type { AppThemeMode } from '../../shared/config/themeMode.ts';
import { getCategory } from '../../shared/functions/productFunctions';
import { InfoTitle } from '../../shared/ui/InfoTitle/InfoTitle';
import { PageShell } from '../../shared/ui/PageShell/PageShell';

import type { ProductStatistics } from './model/types';
import type { PieDatum } from './model/types';
import { columns } from './utils/columnsConfig';
import { computeProductStatistics } from './utils/functions';
import { options } from './utils/optionsConfig';
import { PIE_PALETTE } from './utils/pieConfig';
import { genereteSlidesConfig } from './utils/slidesConfig';
import { cardShellStyle, PAGE_ROW_GUTTER } from './utils/styles';

import './StatisticsPage.css';

type ShippingVariantAggregate = {
  count: number;
  categories: string[];
};

const { Text } = Typography;

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

interface StatisticsPageProps {
  themeMode: AppThemeMode;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ themeMode }) => {
  const limitPerSlide = 5;
  const [selectedStat, setSelectedStat] = useState<string>('highPrice');
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // DOM-узел, в который ol/Map монтируется (target)
  const mapTooltipRef = useRef<HTMLDivElement | null>(null); // DOM для ol/Overlay — плавающий тултип над картой
  const olMapRef = useRef<OlMap | null>(null); // ссылка на экземпляр ol/Map (один раз на жизнь страницы)
  const simulatedPointsSourceRef = useRef<VectorSource | null>(null); // ol/source/Vector — сюда пишем маркеры симуляции

  const accumulateShippingVariantsWithCategories = useCallback((items: Product[] | undefined) => {
    // variantKey доставки → всего товаров + сколько раз встретилась каждая категория (по отображаемому label)
    const buckets = new globalThis.Map<
      string,
      { count: number; categoryCountByLabel: Map<string, number> }
    >();

    for (const item of items ?? []) {
      const variantKey = item.shippingInformation?.trim().toLocaleLowerCase();
      if (!variantKey) continue;

      let bucket = buckets.get(variantKey);
      if (!bucket) {
        bucket = { count: 0, categoryCountByLabel: new Map<string, number>() };
        buckets.set(variantKey, bucket);
      }

      bucket.count += 1;
      const rawCategory = item.category as string;
      const localized = getCategory(rawCategory);
      const label = localized.charAt(0).toUpperCase() + localized.slice(1);
      const prev = bucket.categoryCountByLabel.get(label) ?? 0;
      bucket.categoryCountByLabel.set(label, prev + 1);
    }

    const result: Record<string, ShippingVariantAggregate> = {};
    for (const [variantKey, bucket] of buckets) {
      result[variantKey] = {
        count: bucket.count,
        categories: [...bucket.categoryCountByLabel.entries()]
          .sort((a, b) => a[0].localeCompare(b[0], 'ru'))
          .map(([label, categoryCount]) =>
            categoryCount > 1 ? `${label} (${categoryCount})` : label
          ),
      };
    }
    return result;
  }, []);

  const simulateMoscowDeliveryPoints = useCallback(
    (
      aggregatesByVariant: Record<string, ShippingVariantAggregate>,
      pointsCount: number
    ): Array<{ lon: number; lat: number; shippingInformation: string }> => {
      const variantsWithCounts = Object.entries(aggregatesByVariant).filter(
        ([variant, agg]) => Boolean(variant) && agg.count > 0
      );
      if (!variantsWithCounts.length || pointsCount <= 0) return [];

      const totalCount = variantsWithCounts.reduce((acc, [, agg]) => acc + agg.count, 0);
      console.log(totalCount, 'totalCount');
      console.log(variantsWithCounts, 'variantsWithCounts');
      const variantsSortedByPopularity = [...variantsWithCounts].sort(
        (a, b) => b[1].count - a[1].count
      );
      console.log(variantsSortedByPopularity, 'variantsSortedByPopularity');
      const popularityRankByVariant = new globalThis.Map<string, number>(
        variantsSortedByPopularity.map(([variant], idx) => [variant, idx] as const)
      );
      console.log(popularityRankByVariant, 'popularityRankByVariant');
      const pickShippingInformation = () => {
        let r = Math.random() * totalCount;
        for (const [variant, agg] of variantsWithCounts) {
          r -= agg.count;
          if (r <= 0) return variant;
        }
        return variantsWithCounts[variantsWithCounts.length - 1][0];
      };
      console.log(pickShippingInformation(), 'pickShippingInformation');
      const moscow = { lon: 37.6173, lat: 55.7558 };
      const kmToDegrees = (km: number, latDeg: number) => {
        const dLat = km / 111;
        const dLon = km / (111 * Math.cos((latDeg * Math.PI) / 180));
        return { dLat, dLon };
      };

      const pickDistanceFromMoscowKm = (shippingInformation: string) => {
        const rank = popularityRankByVariant.get(shippingInformation) ?? 0;
        const popularityRatio =
          variantsWithCounts.length <= 1 ? 0 : rank / (variantsWithCounts.length - 1); // 0 = most common
        const base =
          popularityRatio < 0.33
            ? 2 + Math.random() * 8
            : popularityRatio < 0.66
              ? 10 + Math.random() * 15
              : 30 + Math.random() * 50;
        const jitter = (Math.random() - 0.5) * 2; // ±1 км
        return Math.max(0.5, base + jitter);
      };

      const simulatedPoints: Array<{ lon: number; lat: number; shippingInformation: string }> = [];
      for (let i = 0; i < pointsCount; i += 1) {
        const shippingInformation = pickShippingInformation();

        const distanceFromMoscowKm = pickDistanceFromMoscowKm(shippingInformation);
        const angle = Math.random() * 2 * Math.PI;
        const { dLat, dLon } = kmToDegrees(distanceFromMoscowKm, moscow.lat);

        simulatedPoints.push({
          shippingInformation,
          lon: moscow.lon + Math.cos(angle) * dLon,
          lat: moscow.lat + Math.sin(angle) * dLat,
        });
      }

      return simulatedPoints;
    },
    []
  );

  const isAuthenticatedAuth = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticatedUser = useUserStore((s) => s.isAuthenticated);
  const isSessionAuthenticated = isAuthenticatedAuth || isAuthenticatedUser;
  const [selectedView, setSelectedView] = useState<'table' | 'list'>('table');

  const productsPageQuery = useProductPageQuery({
    isAuthenticated: isSessionAuthenticated,
    listFromTextSearch: false,
    selectedId: null,
    selectedCategory: null,
    pageSize: 1,
    pageSkip: 0,
    sortBy: undefined,
    order: undefined,
  });

  const total = productsPageQuery.data?.total ?? 0;
  const allProductsQuery = useProductAllQuery({
    total,
    enabled: isSessionAuthenticated && productsPageQuery.isSuccess,
    isAuthenticated: isSessionAuthenticated,
  });
  const products = allProductsQuery.data;

  const shippingAggregatesByVariant = useMemo(
    () => accumulateShippingVariantsWithCategories(products),
    [products, accumulateShippingVariantsWithCategories]
  );

  const simulatedMoscowPoints = useMemo(() => {
    return simulateMoscowDeliveryPoints(shippingAggregatesByVariant, 6);
  }, [shippingAggregatesByVariant, simulateMoscowDeliveryPoints]);

  // OpenLayers: обновление векторного слоя — пересоздаём Feature для каждой симулированной точки
  useEffect(() => {
    if (!simulatedMoscowPoints.length) return;

    const source = simulatedPointsSourceRef.current; // ol/source/Vector, созданный при инициализации карты
    if (!source) return;

    source.clear(); // убрать старые ol/Feature с карты перед новой порцией данных
    source.addFeatures(
      simulatedMoscowPoints.map((p, bucketIndex) => {
        const agg = shippingAggregatesByVariant[p.shippingInformation];
        const count = agg?.count ?? 0;
        const categories = agg?.categories ?? [];
        const f = new Feature({
          geometry: new Point(fromLonLat([p.lon, p.lat])), // ol/geom/Point в проекции карты (из WGS84)
          shippingInformation: p.shippingInformation, // произвольные поля — читаются в forEachFeatureAtPixel
          bucketIndex, // порядковый индекс симулированной точки (0..n-1) — для тултипа / hit-test
          count,
          categories,
        });
        return f;
      })
    );
  }, [simulatedMoscowPoints, shippingAggregatesByVariant]);

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

  const chartConfig = {
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
  const handleViewChange = useCallback(
    (view: 'table' | 'list') => {
      if (view === selectedView) return;
      setSelectedView(view);
    },
    [setSelectedView, selectedView]
  );

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
      label: false,
      tooltip: {
        title: (datum: PieDatum) => datum.categoryName,
        items: [
          (datum: PieDatum) => ({
            name: 'Товаров',
            value: `${datum.categoryCount} шт · ${datum.percent.toFixed(2)}%`,
            color: '#4a5cff',
          }),
        ],
      },
      animate: { enter: { type: 'waveIn', duration: 800 } },
    };
  }, [pieData]);

  // OpenLayers: инициализация карты один раз (TileLayer + VectorLayer + View + Overlay + interactions)
  useEffect(() => {
    const target = mapContainerRef.current; // HTMLElement — target для ol/Map
    if (!target) return;
    if (olMapRef.current) return; // не создавать вторую ol/Map при StrictMode / повторном эффекте
    const tooltipEl = mapTooltipRef.current; // элемент для ol/Overlay (тултип)

    const geoSource = new VectorSource(); // ol/source/Vector — коллекция ol/Feature (маркеры)
    simulatedPointsSourceRef.current = geoSource; // ref, чтобы другой useEffect мог вызывать clear/addFeatures

    const geoLayer = new VectorLayer({
      source: geoSource, // привязка источника к слою
      style: new Style({
        image: new CircleStyle({
          radius: 6, // радиус маркера в px
          fill: new Fill({ color: '#4a5cff' }), // заливка круга
          stroke: new Stroke({ color: '#ffffff', width: 2 }), // обводка круга
        }),
      }),
    });

    const map = new OlMap({
      layers: [
        new TileLayer({
          source: new OSM(), // ol/source/OSM — тайлы подложки
        }),
        geoLayer, // ol/layer/Vector — маркеры поверх TileLayer
      ],
      target, // сюда ol рендерит canvas + контролы
      view: new View({
        center: fromLonLat([37.6173, 55.7558]), // ol/View — стартовый центр (Москва) в EPSG:3857
        zoom: 11, // ol/View — уровень масштаб
      }),
    });

    const extent = new ExtentInteraction({ condition: shiftKeyOnly }); // ol/interaction/Extent + условие по Shift
    map.addInteraction(extent); // регистрация взаимодействия на ol/Map

    const tooltipOverlay =
      tooltipEl &&
      new Overlay({
        element: tooltipEl, // HTML узел, который ol позиционирует над картой
        offset: [10, 0], // сдвиг оверлея от якорной точки (px)
        positioning: 'center-left', // как стыкуется element к координате
        stopEvent: false, // события мыши проходят на карту (панорамирование не блокируется)
      });

    if (tooltipOverlay) {
      map.addOverlay(tooltipOverlay); // ol/Overlay добавляется отдельно от layers
    }

    const onPointerMove = (evt: { pixel: number[]; coordinate: number[]; dragging?: boolean }) => {
      if (!tooltipEl || !tooltipOverlay) return;
      if (evt.dragging) return; // во время drag карты не дергаем тултип

      // forEachFeatureAtPixel: по пикселю evt.pixel проходит видимые слои сверху вниз и отдаёт первый ol/Feature.
      // Данные в feature — это то, что передали в new Feature({ ... }) и VectorSource.addFeatures (count, categories, bucketIndex, …).
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f) as Feature | undefined;

      if (!feature) {
        tooltipEl.style.display = 'none';
        return;
      }

      const bucketIndex = feature.get('bucketIndex'); // number | undefined — задали при addFeatures
      const count = Number(feature.get('count') ?? 0); // ol/Feature#get — пользовательские поля
      const categories = (feature.get('categories') as string[] | undefined) ?? [];

      tooltipEl.replaceChildren();

      if (typeof bucketIndex === 'number') {
        const bucketRow = document.createElement('div');
        bucketRow.className = 'mapTooltip__bucket';
        bucketRow.textContent = `Склад №${bucketIndex + 1}`;
        tooltipEl.appendChild(bucketRow);
      }

      const countRow = document.createElement('div');
      countRow.className = 'mapTooltip__count';
      countRow.textContent = `${count} товаров`;

      const metaRow = document.createElement('div');
      metaRow.className = 'mapTooltip__meta';

      const labelEl = document.createElement('span');
      labelEl.className = 'mapTooltip__label';
      labelEl.textContent = 'Категории';

      const catsEl = document.createElement('span');
      catsEl.className = 'mapTooltip__cats';
      catsEl.textContent = categories.length > 0 ? categories.join(', ').replace(/, /g, '\n') : '—';

      metaRow.append(labelEl, catsEl);
      tooltipEl.append(countRow, metaRow);
      tooltipEl.style.display = 'flex';
      tooltipOverlay.setPosition(evt.coordinate); // ol/Overlay — привязка к evt.coordinate (EPSG:3857)
    };

    map.on('pointermove', onPointerMove); // ol/Map#on — подписка на движение указателя
    map.getViewport().addEventListener('mouseleave', () => {
      if (!tooltipEl || !tooltipOverlay) return;
      tooltipEl.style.display = 'none';
    });

    olMapRef.current = map; // сохранить ol/Map для защиты от повторной инициализации

    return () => {
      map.un('pointermove', onPointerMove); // ol/Map#un — отписка от события
      map.setTarget(undefined); // ol/Map — отмонтировать карту от DOM (очистка webgl/canvas)
      olMapRef.current = null;
      simulatedPointsSourceRef.current = null;
    };
  }, []);

  return (
    <PageShell
      themeMode={themeMode}
      title="Статистика"
      description="Сводка по выбранным срезам каталога, распределение товаров по категориям."
    >
      <Flex vertical style={{ width: '100%', gap: 16 }}>
        <Card
          variant="borderless"
          styles={{ body: { padding: 16 } }}
          style={cardShellStyle(themeMode)}
          extra={
            <Segmented<'table' | 'list'>
              value={selectedView}
              onChange={(v) => {
                handleViewChange(v);
              }}
              options={[
                { label: 'В столбик', value: 'table', icon: <UnorderedListOutlined /> },
                { label: 'Две колонки', value: 'list', icon: <TableOutlined /> },
              ]}
            />
          }
        >
          <Row gutter={PAGE_ROW_GUTTER} align="stretch">
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

        {selectedView === 'table' ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
              <RatingCardLazy
                themeMode={themeMode}
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
              styles={{ body: { paddingTop: 8 } }}
              style={cardShellStyle(themeMode)}
            >
              <InfoTitle
                title="Распределение по категориям"
                subtitle="График распределения товаров по категориям."
              />
              <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
                <ChartLazy config={chartConfig} />
              </Suspense>
            </Card>
            <Card variant="borderless" style={cardShellStyle(themeMode)}>
              <InfoTitle
                title="Доля категорий"
                subtitle="Показаны категории с количеством товаров больше 1."
              />
              <div style={{ position: 'relative', width: '100%', height: 420 }}>
                <Pie {...pieConfig} style={{ width: '100%', height: 420 }} />
              </div>
            </Card>
          </Space>
        ) : (
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
              <RatingCardLazy
                themeMode={themeMode}
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
            <Row gutter={PAGE_ROW_GUTTER} align="stretch">
              <Col xs={24} xl={14}>
                <Card
                  variant="borderless"
                  title="Распределение по категориям"
                  styles={{ body: { paddingTop: 8 } }}
                  style={{ ...cardShellStyle, height: '100%' }}
                >
                  <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
                    <ChartLazy config={chartConfig} />
                  </Suspense>
                </Card>
              </Col>
              <Col xs={24} xl={10}>
                <Card
                  variant="borderless"
                  title="Доля категорий"
                  style={{ ...cardShellStyle, height: '100%' }}
                >
                  <Text type="secondary">Показаны категории с количеством товаров больше 1.</Text>
                  <div style={{ position: 'relative', width: '100%', height: 420 }}>
                    <Pie {...pieConfig} style={{ width: '100%', height: 420 }} />
                  </div>
                </Card>
              </Col>
            </Row>
          </Space>
        )}
      </Flex>
      <Flex>
        <InfoTitle
          title="Распределение товарных запасов"
          subtitle="Карта распределения товарных запасов по складам."
        />
        <div className="mapWrapper" style={{ width: '100%' }}>
          {/* OpenLayers: контейнер target для ol/Map (высота/ширина — в StatisticsPage.css) */}
          <div ref={mapContainerRef} className="map" style={{ width: '100%' }}></div>
          {/* OpenLayers: element для ol/Overlay — позицию задаёт overlay.setPosition в pointermove */}
          <div ref={mapTooltipRef} className="mapTooltip" />
        </div>
      </Flex>
    </PageShell>
  );
};
export { StatisticsPage };
