import type { TableProps } from 'antd';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

type ProductFormFieldsType = {
  title: string;
  brand: string;
  category: string;
  sku: string;
  price: string;
  rating: string;
};

type ViewModeType = 'page' | 'category' | 'text' | 'id';

type FiltersPropsType = {
  category: string | null;
  query: string | null;
  id: string | null;
};
export type { FiltersPropsType, ProductFormFieldsType, TableRowSelection, ViewModeType };
