import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { FormProps } from 'antd';
import {
  Button,
  Carousel,
  Descriptions,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Table,
  Typography,
} from 'antd';

import { useProductStore } from '../../entities/product/model/productStore';
import type { Product, Products } from '../../entities/product/model/types';
import { ProductSearch } from '../../entities/product/ui/ProductSearch/ProductSearch';
import { ProductTable } from '../../entities/product/ui/ProductTable/ProductTable';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import AddIcon from '../../shared/assets/add-icon.svg?react';
import RefreshIcon from '../../shared/assets/refresh-icon.svg?react';
import { categoryMap } from '../../shared/lib/categoryConfig';
import { PageShell } from '../../shared/ui/PageShell/PageShell';
import { pageTitleStyle } from '../stats/utils/styles';

import { useProductsTableData } from './hooks/useProductTableData';
import { useTablePaginationSort } from './hooks/useTablePaginationSort';
import type {
  FiltersPropsType,
  ProductFormFieldsType,
  TableRowSelection,
  ViewModeType,
} from './model/types';

import './TablePage.css';

const { Title } = Typography;

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

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (viewMode !== 'text') return;

    const timeout = setTimeout(() => {
      const normalizedQuery = searchText.trim().toLowerCase();
      setFilters((prev) => ({ ...prev, query: normalizedQuery.length ? normalizedQuery : null }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText, viewMode]);

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
  const productsPaginatedQueryKey = useMemo(
    () =>
      [
        'products',
        'paginated',
        pagination.pageSize,
        pageSkip,
        apiSortBy ?? '',
        apiOrder ?? '',
      ] as const,
    [pagination.pageSize, pageSkip, apiSortBy, apiOrder]
  );

  const queryClient = useQueryClient();

  const productsTableData = useProductsTableData(
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

      if (viewMode === 'page') {
        queryClient.setQueryData<Products>([...productsPaginatedQueryKey], (old) => {
          const row = useProductStore.getState().products?.products?.[0];
          if (!old || !row) return old;
          return {
            ...old,
            products: [row, ...(old.products ?? [])],
            total: old.total + 1,
          };
        });
      }

      message.success('Продукт успешно добавлен!');
      setIsProductPopupOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('Ошибка при добавлении продукта');
    }
  };

  const onFinishFailed: FormProps<ProductFormFieldsType>['onFinishFailed'] = (_errorInfo) => {
    message.error('Пожалуйста, исправьте ошибки в форме');
  };

  const searchQuoteRef = useRef(null);

  const clearFiltersToPage = () => {
    setPagination((p) => ({ ...p, current: 1 }));
    setSearchText('');
    setViewMode('page');
    setFilters({ category: null, query: null, id: null });
  };

  const paginationConfig = {
    className: 'custom-pagination',
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: productsTableData.total,
    showQuickJumper: false,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    onChange: (page: number, pageSize: number) => {
      clearFiltersToPage();
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
    productsTableData.refetch();
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
      setSearchText('');
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
      <Flex justify="space-between" gap={12} wrap="wrap" align="stretch">
        <Flex
          gap={8}
          align="center"
          wrap="wrap"
          style={{
            borderRadius: '12px',
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#fff',
            padding: '12px 16px',
          }}
        >
          <ProductSearch
            ref={searchQuoteRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value: string) => handleSearch(value)}
          />
          <Button
            aria-label="Обновить список товаров"
            icon={<RefreshIcon />}
            className="table-refresh-btn"
            onClick={handleRefresh}
          ></Button>
          <Button type="primary" icon={<AddIcon />} className="table-add-btn" onClick={showModal}>
            Добавить
          </Button>
        </Flex>

        <Flex
          vertical
          gap={0}
          style={{
            borderRadius: '12px',
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#fff',
            padding: '12px 16px',
          }}
        >
          <Title level={4} style={pageTitleStyle}>
            Категория
          </Title>
          <Flex gap={6} wrap="wrap" justify="center" align="center">
            <Button type="primary" onClick={handleAllCategoriesClick}>
              Все категории
            </Button>

            {categoryOptions.length > 0 &&
              categoryOptions.map(({ value, label }) => {
                return (
                  <Button
                    key={value}
                    aria-label={label}
                    onClick={() => handleCategoryClick(value)}
                    className={filters.category === value ? 'table-category-btn-active' : ''}
                  >
                    {label}
                  </Button>
                );
              })}
          </Flex>
        </Flex>
      </Flex>
      <Flex vertical gap={0} style={{ width: '100%' }}>
        <Flex justify="space-between" gap={0} wrap="wrap" align="center">
          <Title className="table-title">
            Все позиции: {productsTableData.total > 0 ? productsTableData.total : '0'}
          </Title>
        </Flex>

        <ProductTable
          emptyText={productsTableData.emptyText}
          isLoading={productsTableData.loading}
          onOpenInfoModal={openInfoModal}
          data={productsTableData.data}
          sortedInfo={sortedInfo ?? { columnKey: undefined, order: undefined }}
          errorMessage={productsTableData.errorMessage}
          onChange={(...args) => {
            clearFiltersToPage();
            handleTableChange(...args);
          }}
          rowSelection={rowSelection}
          paginationConfig={paginationConfig}
        />
      </Flex>

      <Modal
        centered={true}
        title="Добавить товар"
        closable={true}
        open={isProductPopupOpen}
        onCancel={handleModalClose}
        forceRender
        footer={null}
      >
        <Form
          form={form}
          name="product-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            aria-label="Наименование"
            name="title"
            rules={[
              { required: true, message: 'Обязательное поле' },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,25}$/,
                message: 'Буквы, цифры и знаки препинания',
              },
            ]}
          >
            <Input placeholder="Наименование" tabIndex={0} />
          </Form.Item>

          <Form.Item
            aria-label="Вендор"
            name="brand"
            rules={[
              { required: true, message: 'Обязательное поле' },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,15}$/,
                message: 'Буквы, цифры и знаки препинания',
              },
            ]}
          >
            <Input placeholder="Вендор" />
          </Form.Item>

          <Form.Item
            aria-label="Категория"
            name="category"
            rules={[
              { required: true, message: 'Обязательное поле' },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,15}$/,
                message: 'Буквы, цифры и знаки препинания',
              },
            ]}
          >
            <Input placeholder="Категория" />
          </Form.Item>

          <Form.Item
            aria-label="Артикул"
            name="sku"
            rules={[
              { required: true, message: 'Обязательное поле' },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,12}$/,
                message: 'Буквы, цифры и знаки препинания',
              },
            ]}
          >
            <Input placeholder="Артикул" />
          </Form.Item>

          <Form.Item
            aria-label="Оценка"
            name="rating"
            rules={[
              { required: true, message: 'Обязательное поле' },
              { pattern: /^[1-5]$/, message: 'Введите число от 1 до 5' },

              {
                validator: (_, value) =>
                  !value || (Number(value) >= 1 && Number(value) <= 5)
                    ? Promise.resolve()
                    : Promise.reject(new Error('От 1 до 5')),
              },
            ]}
          >
            <Input type="number" placeholder="Оценка" />
          </Form.Item>

          <Form.Item
            aria-label="Цена"
            name="price"
            rules={[
              { required: true, message: 'Обязательное поле' },
              { pattern: /^\d+(\.\d{1,2})?$/, message: 'Введите корректную цену' },
              {
                validator: (_, value) =>
                  !value || Number(value) > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error('Цена должна быть больше 0')),
              },
            ]}
          >
            <Input type="number" placeholder="Цена" />
          </Form.Item>
          <Flex justify="space-between">
            <Flex gap={10}>
              <Button type="default" htmlType="reset" onClick={handleReset} aria-label="Сбросить">
                Сбросить
              </Button>
              <Button type="primary" htmlType="submit" aria-label="Добавить">
                Добавить
              </Button>
            </Flex>
            <Button type="default" onClick={handleModalClose} aria-label="Закрыть">
              Закрыть
            </Button>
          </Flex>
        </Form>
      </Modal>
      <Modal
        title="Карточка товара"
        centered
        open={infoModalOpen}
        onCancel={closeInfoModal}
        footer={null}
      >
        {selectedProduct && (
          <>
            <Carousel
              autoplay
              arrows
              dots
              style={{ width: '300px', height: '300px', margin: '0 auto' }}
            >
              {selectedProduct.images &&
                selectedProduct.images.map((image, key) => {
                  return (
                    <Image
                      src={image}
                      key={key}
                      alt={selectedProduct.title}
                      width={300}
                      height={300}
                    />
                  );
                })}
            </Carousel>
            <Descriptions bordered column={1} layout="horizontal">
              <Descriptions.Item label="Наименование">
                {selectedProduct.title ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Вендор">{selectedProduct.brand ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Цена">{selectedProduct.price ?? '—'} ₽</Descriptions.Item>
              <Descriptions.Item label="Рейтинг">{selectedProduct.rating ?? '—'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </PageShell>
  );
};

export { TablePage };
