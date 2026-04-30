import type { TablePaginationConfig } from 'antd';
import type { FormInstance } from 'antd';
import type { FormProps } from 'antd';
import type { TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import type { Product } from '../../../../entities/product/model/types';
import type { ProductFormFieldsType } from '../../model/types';
import type { ProductsTableDataProps } from '../../TablePage';

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
export type { ProductTableBlockProps };
