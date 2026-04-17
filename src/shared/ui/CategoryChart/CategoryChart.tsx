import { type FC, useMemo, useState } from 'react';
import { Column } from '@ant-design/charts';
import { Flex, Select } from 'antd';

import type { CategoryChartProps, CategoryRow } from './model/types';
import { ALL_VALUE, SORT_ASC, SORT_DESC, SORT_NONE } from './utils/selectConfig';

const CategoryChart: FC<CategoryChartProps> = ({ config }) => {
  const fullData = useMemo((): CategoryRow[] => {
    const raw = config.data;
    if (!Array.isArray(raw)) return [];
    return raw as CategoryRow[];
  }, [config.data]);

  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_VALUE);
  const [selectedSorting, setSelectedSorting] = useState<string>(SORT_ASC);

  const validCategory = useMemo(() => {
    if (selectedCategory === ALL_VALUE) return ALL_VALUE;
    return fullData.some((row) => row.categoryName === selectedCategory)
      ? selectedCategory
      : ALL_VALUE;
  }, [fullData, selectedCategory]);

  const selectOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: 'Все категории' },
      ...fullData.map((row) => ({
        value: row.categoryName,
        label: row.categoryName,
      })),
    ],
    [fullData]
  );

  const chartRows = useMemo(() => {
    if (validCategory === ALL_VALUE) return fullData;
    return fullData.filter((row) => row.categoryName === validCategory);
  }, [fullData, validCategory]);

  const sortingOptions = useMemo(
    () => [
      { value: SORT_NONE, label: 'Без сортировки' },
      { value: SORT_ASC, label: 'По возрастанию' },
      { value: SORT_DESC, label: 'По убыванию' },
    ],
    []
  );

  const sortedChartRows = useMemo(() => {
    const rows = [...chartRows];
    if (selectedSorting === SORT_NONE) return rows;
    rows.sort((a, b) =>
      selectedSorting === SORT_ASC
        ? a.categoryCount - b.categoryCount
        : b.categoryCount - a.categoryCount
    );
    return rows;
  }, [chartRows, selectedSorting]);

  return (
    <>
      <Flex wrap gap={12}>
        <Select
          allowClear={false}
          value={validCategory}
          options={selectOptions}
          onChange={(value) => setSelectedCategory(value)}
          style={{ minWidth: 220, maxWidth: 360, flex: '1 1 220px' }}
          placeholder="Категория"
        />
        <Select
          allowClear={false}
          value={selectedSorting}
          options={sortingOptions}
          onChange={(value) => setSelectedSorting(value)}
          style={{ minWidth: 220, maxWidth: 360, flex: '1 1 220px' }}
          placeholder="Сортировка"
        />
      </Flex>
      <Column {...config} data={sortedChartRows} />
    </>
  );
};

export { CategoryChart };
