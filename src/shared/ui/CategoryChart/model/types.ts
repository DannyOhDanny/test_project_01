import type { ColumnConfig } from '@ant-design/charts';
type CategoryRow = {
  categoryName: string;
  categoryCount: number;
};

type CategoryChartProps = {
  config: ColumnConfig;
};
export type { CategoryChartProps, CategoryRow };
