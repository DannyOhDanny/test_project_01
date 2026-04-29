import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InputRef } from 'antd';
import type { FormProps } from 'antd';
import type { TablePaginationConfig } from 'antd';
import { Form, message, Table } from 'antd';

import { useProductStore } from '../../entities/product/model/productStore';
import type { Product, Products } from '../../entities/product/model/types';
import { productKeys } from '../../entities/product/productKeys';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import { categoryMap } from '../../shared/lib/categoryConfig';
import { PageShell } from '../../shared/ui/PageShell/PageShell';

import { useProductsTableData } from './hooks/useProductTableData';
import { useTablePaginationSort } from './hooks/useTablePaginationSort';
import type {
  FiltersPropsType,
  ProductFormFieldsType,
  TableRowSelection,
  ViewModeType,
} from './model/types';
import { ProductTableBlock } from './ui/ProductTableBlock';
import { TableCategoriesBlock } from './ui/TableCategoriesBlock';
import { TableSearchBlock } from './ui/TableSearchBlock';

import './TablePage.css';

export interface ProductsTableDataProps {
  total: number;
  emptyText: string;
  loading: boolean;
  data: Product[];
  errorMessage: string | null;
  refetch: () => Promise<unknown>;
}

const TablePage: React.FC = () => {
  const isAuthenticatedAuth = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticatedUser = useUserStore((s) => s.isAuthenticated);
  const isSessionAuthenticated = isAuthenticatedAuth || isAuthenticatedUser;
  const { addProduct } = useProductStore();

  const {
    pagination,
    pageSkip,
    sortedInfo,
    apiSortBy,
    apiOrder,
    handleTableChange,
    setPagination,
  } = useTablePaginationSort<Product>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewModeType>('page');
  const [filters, setFilters] = useState<FiltersPropsType>({
    category: null,
    query: null,
    id: null,
  });

  const [isProductPopupOpen, setIsProductPopupOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  const [form] = Form.useForm<ProductFormFieldsType>();
  const searchQuoteRef = useRef<InputRef | null>(null);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (viewMode !== 'text') return;

    const timeout = setTimeout(() => {
      const normalizedQuery = searchText.trim().toLowerCase();
      setFilters((prev) => ({ ...prev, query: normalizedQuery.length ? normalizedQuery : null }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText, viewMode]);

  const handleSearchTextChange = (next: string) => {
    setSearchText(next);

    if (next.trim() === '') {
      setPagination((p) => ({ ...p, current: 1 }));
      setViewMode('page');
      setFilters({ category: null, query: null, id: null });
    }
  };

  const handleCategoryClick = (newCategory: string) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchText('');
    setFilters({ category: newCategory, query: null, id: null });
    setViewMode('category');
  };
  const handleAllCategoriesClick = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchText('');
    setViewMode('page');
    setFilters({ category: null, query: null, id: null });
  };

  const queryClient = useQueryClient();

  const productsTableData: ProductsTableDataProps = useProductsTableData(
    viewMode,
    filters,
    isSessionAuthenticated,
    pagination.pageSize,
    pageSkip,
    apiSortBy,
    apiOrder
  );

  const openInfoModal = (product: Product) => {
    setSelectedProduct(product);
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setInfoModalOpen(false);
    setSelectedProduct(null);
  };

  const showModal = () => {
    setIsProductPopupOpen(true);
  };
  const handleModalClose = () => {
    setIsProductPopupOpen(false);
  };

  const handleReset = () => {
    form?.resetFields();
  };

  const onFinish: FormProps<ProductFormFieldsType>['onFinish'] = (values) => {
    try {
      addProduct({
        title: values.title,
        brand: values.brand,
        category: values.category,
        sku: values.sku,
        price: Number(values.price),
        rating: Number(values.rating),
      });

      const row = useProductStore.getState().products?.products?.[0];
      if (!row) return;

      setPagination((p) => ({ ...p, current: 1 }));

      queryClient.setQueryData<Products>(
        productKeys.paginated({
          limit: pagination.pageSize,
          skip: 0,
          sortBy: apiSortBy,
          order: apiOrder,
        }),
        (old) => {
          const prevProducts = old?.products ?? [];
          const prevTotal = old?.total ?? prevProducts.length;

          const withoutSameSku = prevProducts.filter((p) => p.sku !== row.sku);

          const merged = [row, ...withoutSameSku];
          const limited = merged.slice(0, pagination.pageSize);

          return {
            products: limited,
            total: prevTotal + 1,
            skip: 0,
            limit: old?.limit ?? pagination.pageSize,
          };
        }
      );
    } catch {
      message.error('Ошибка при добавлении товара');
    } finally {
      form.resetFields();
      handleModalClose();
    }
  };

  const onFinishFailed: FormProps<ProductFormFieldsType>['onFinishFailed'] = (_errorInfo) => {
    message.error('Пожалуйста, исправьте ошибки в форме');
  };

  const paginationConfig: TablePaginationConfig = {
    className: 'custom-pagination',
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: productsTableData.total,
    showQuickJumper: false,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    onChange: (page: number, pageSize: number) => {
      setPagination({ current: page, pageSize });
    },
    showTotal: (total: number, range: number[]) => (
      <div
        style={{
          display: 'flex',
          gap: '4px',
          flexDirection: 'row',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--third-family)',
          fontWeight: 350,
          fontSize: '18px',
          lineHeight: '1.7',
        }}
      >
        <span style={{ color: '#969b9f' }}>Показано </span>
        <span style={{ color: '#333' }}>
          {range[0]}-{range[1]}
        </span>
        <span style={{ color: '#969b9f' }}> из </span>
        <span style={{ color: '#333' }}>{total}</span>
      </div>
    ),
    locale: {
      items_per_page: 'на стр.',
      jump_to: 'Перейти к',
      page: 'Страница',
      prev_page: 'Предыдущая страница',
      next_page: 'Следующая страница',
      prev_5: 'Предыдущие 5 страниц',
      next_5: 'Следующие 5 страниц',
      prev_3: 'Предыдущие 3 страницы',
      next_3: 'Следующие 3 страницы',
    },
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Product> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Нечетные',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Четные',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleRefresh = () => {
    setViewMode('page');
    setFilters({ category: null, query: null, id: null });
    setSearchText('');
    setPagination((p) => ({ ...p, current: 1 }));
    setSelectedRowKeys([]);

    queryClient.invalidateQueries({
      queryKey: productKeys.paginated({
        limit: pagination.pageSize,
        skip: 0,
        sortBy: apiSortBy,
        order: apiOrder,
      }),
    });
  };

  const handleSearch = (raw: string) => {
    const text = raw.trim();
    setPagination((p) => ({ ...p, current: 1 }));
    if (text === '') {
      setViewMode('page');
      setFilters({ category: null, query: null, id: null });
      setSearchText('');
      return;
    }

    const numericId = Number(text);
    if (!Number.isNaN(numericId) && numericId > 0) {
      setFilters({ id: String(numericId), query: null, category: null });
      setViewMode('id');
      setSearchText(text);
      return;
    }

    setViewMode('text');
    setSearchText(text);
    setFilters({ category: null, query: null, id: null });
  };

  const categoryOptions = useMemo(() => {
    return Object.entries(categoryMap).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }, []);

  return (
    <PageShell
      title="Товары"
      description="Поиск по каталогу, таблица позиций и добавление записей."
    >
      <TableSearchBlock
        searchQuoteRef={searchQuoteRef}
        searchText={searchText}
        setSearchText={handleSearchTextChange}
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
      />
      <TableCategoriesBlock
        categoryOptions={categoryOptions}
        handleAllCategoriesClick={handleAllCategoriesClick}
        handleCategoryClick={handleCategoryClick}
        filters={filters}
      />

      <ProductTableBlock
        isProductPopupOpen={isProductPopupOpen}
        handleModalClose={handleModalClose}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleReset={handleReset}
        productsTableData={productsTableData}
        openInfoModal={openInfoModal}
        closeInfoModal={closeInfoModal}
        selectedProduct={selectedProduct}
        sortedInfo={sortedInfo}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        paginationConfig={paginationConfig}
        infoModalOpen={infoModalOpen}
        showModal={showModal}
      />
    </PageShell>
  );
};

export { TablePage };
