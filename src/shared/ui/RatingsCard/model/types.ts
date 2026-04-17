import type { ReactNode } from 'react';

import type { SelectProps, TableColumnsType } from 'antd';

import type { Product } from '../../../../entities/product/model/types';

export type RatingsCardProps = {
  title?: ReactNode;
  tag?: ReactNode;

  data: Product[];
  columns: TableColumnsType<Product>;

  options: NonNullable<SelectProps['options']>;
  selectedStat: string;
  onSelectStat: (value: string) => void;

  loading?: boolean;
  emptyText?: ReactNode;

  /** Optional small counter at top-right, e.g. "5 поз." */
  countText?: ReactNode;
};
