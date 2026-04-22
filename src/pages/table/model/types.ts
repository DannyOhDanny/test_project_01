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
export type { ProductFormFieldsType, TableRowSelection };
