import type { TableProps } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import type { Product } from '../../../model/types';

type ProductTableProps = {
  emptyText?: string | undefined;
  errorMessage?: string | null;
  isLoading: boolean;
  data: Product[];
  sortedInfo: SorterResult<Product>;
  onChange: TableProps<Product>['onChange'];
  rowSelection: TableProps<Product>['rowSelection'];
  paginationConfig: TablePaginationConfig;
  onOpenInfoModal: (product: Product) => void;
};

export type { ProductTableProps };
