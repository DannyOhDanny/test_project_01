import type { TableProps } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { FormInstance } from 'antd';
import type { FormProps } from 'antd';
import type { InputRef } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import type { Product } from '../../../entities/product/model/types';
import type { ProductsTableDataProps } from '../TablePage';
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

type ProductFormFieldsType = {
  title: string;
  brand: string;
  category: string;
  sku: string;
  price: string;
  rating: string;
};
interface TableCategoriesBlockProps {
  categoryOptions: { value: string; label: string }[];
  handleAllCategoriesClick: () => void;
  handleCategoryClick: (value: string) => void;
  filters: { category: string | null };
}
type ViewModeType = 'page' | 'category' | 'text' | 'id';

type FiltersPropsType = {
  category: string | null;
  query: string | null;
  id: string | null;
};
interface ProductTableBlockProps {
  productsTableData: ProductsTableDataProps;
  openInfoModal: (product: Product) => void;
  closeInfoModal: (
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLElement>
  ) => void;
  selectedProduct: Product | null;
  sortedInfo: SorterResult<Product> | null;
  handleTableChange: TableProps<Product>['onChange'];
  rowSelection: TableProps<Product>['rowSelection'];
  paginationConfig: TablePaginationConfig;
  infoModalOpen: boolean;
  showModal: () => void;
  form: FormInstance<ProductFormFieldsType>;
  onFinish: FormProps<ProductFormFieldsType>['onFinish'];
  onFinishFailed: FormProps<ProductFormFieldsType>['onFinishFailed'];
  handleReset: () => void;
  handleModalClose: () => void;
  isProductPopupOpen: boolean;
}
interface TableSearchBlockProps {
  searchQuoteRef: React.RefObject<InputRef | null> | null;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (value: string) => void;
  handleRefresh: () => void;
}
export type {
  FiltersPropsType,
  ProductFormFieldsType,
  ProductTableBlockProps,
  TableCategoriesBlockProps,
  TableRowSelection,
  TableSearchBlockProps,
  ViewModeType,
};
