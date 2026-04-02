import type { TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import type { Product } from '../../../model/types';

type PaginationConfigProps = {
  current: number;
  pageSize: number;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
  onChange: (page: number, pageSize: number) => void;
};

type ProductTableProps = {
  data: Product[];
  sortedInfo: SorterResult<Product>;
  onChange: TableProps<Product>['onChange'];
  rowSelection: TableProps<Product>['rowSelection'];
  paginationConfig: PaginationConfigProps;
  onOpenInfoModal: (product: Product) => void;
};

export type { PaginationConfigProps, ProductTableProps };
