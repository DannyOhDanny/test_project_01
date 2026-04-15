import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { TableProps } from 'antd';
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
  Skeleton,
  Table,
  Typography,
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import axios from 'axios';

import { usePorductPageQuery } from '../../entities/product/api/usePorductPageQuery';
import { useProductByIdQuery } from '../../entities/product/api/useProductByIdQuery';
import { useProductSearchQuery } from '../../entities/product/api/useProductSearchQuery';
import { useProductStore } from '../../entities/product/model/productStore';
import { type Product } from '../../entities/product/model/types';
import { ProductSearch } from '../../entities/product/ui/ProductSearch/ProductSearch';
import { ProductTable } from '../../entities/product/ui/ProductTable/ProductTable';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useUserStore } from '../../entities/user/model/userStore';
import AddIcon from '../../shared/assets/add-icon.svg?react';
import RefreshIcon from '../../shared/assets/refresh-icon.svg?react';

import './TablePage.css';

const { Title, Text } = Typography;

/** Текст из тела ответа (message) или из axios-интерцептора (userMessage), а не только error.message. */
function getQueryErrorMessage(error: unknown): string {
  if (error !== null && typeof error === 'object' && 'userMessage' in error) {
    const userMessage = (error as { userMessage?: unknown }).userMessage;
    if (typeof userMessage === 'string' && userMessage.length > 0) {
      return userMessage;
    }
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.length > 0) {
        return msg;
      }
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

type ProductFormFieldsType = {
  title: string;
  brand: string;
  category: string;
  sku: string;
  price: string;
  rating: string;
};
const TablePage: React.FC = () => {
  const isAuthenticatedAuth = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticatedUser = useUserStore((s) => s.isAuthenticated);
  const isSessionAuthenticated = isAuthenticatedAuth || isAuthenticatedUser;
  const { addProduct } = useProductStore();

  const [listFromTextSearch, setListFromTextSearch] = useState(false);
  const [isIdSearch, setIsIdSearch] = useState(false);

  const getInitialSort = (): SorterResult<Product> | null => {
    const savedSort = localStorage.getItem('sortOrder');

    if (!savedSort) return null;

    try {
      return JSON.parse(savedSort);
    } catch {
      return null;
    }
  };

  const [sortedInfo, setSortedInfo] = useState<SorterResult<Product> | null>(getInitialSort);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [poductPopupOpen, setProductPopupOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  const [form] = Form.useForm<ProductFormFieldsType>();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: Number(localStorage.getItem('tablePageSize')) || 5,
  });
  const pageSkip = (pagination.current - 1) * pagination.pageSize;

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  let apiSortBy: string | undefined;
  let apiOrder: 'asc' | 'desc' | undefined;
  if (sortedInfo?.order) {
    apiSortBy = sortedInfo.columnKey?.toString();
    apiOrder = sortedInfo.order === 'ascend' ? 'asc' : 'desc';
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(t);
  }, [searchText]);

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

  const normalized = debouncedSearchText.trim().toLowerCase();

  const productSearchQuery = useProductSearchQuery({
    isAuthenticated: isSessionAuthenticated,
    listFromTextSearch,
    query: normalized,
  });

  const productIdSearchQuery = useProductByIdQuery({
    isAuthenticated: isSessionAuthenticated,
    selectedId,
    listFromTextSearch,
  });

  const productsPageQuery = usePorductPageQuery({
    isAuthenticated: isSessionAuthenticated,
    listFromTextSearch,
    selectedId,
    pageSize: pagination.pageSize,
    pageSkip,
    sortBy: apiSortBy,
    order: apiOrder,
  });

  const isProductsPagePending = productsPageQuery.isPending;
  const isProductsPageLoading = productsPageQuery.isLoading;
  const isProductsPageError = productsPageQuery.isError;
  const isProductsPageFetching = productsPageQuery.isFetching;
  const productsPageError = productsPageQuery.error;
  const isProductsSearchPending = productSearchQuery.isPending;
  const isProductsSearchLoading = productSearchQuery.isLoading;
  const isProductsSearchError = productSearchQuery.isError;
  const isProductsSearchFetching = productSearchQuery.isFetching;
  const productsSearchError = productSearchQuery.error;

  const isProductIdSearchPending = productIdSearchQuery.isPending;
  const isProductIdSearchLoading = productIdSearchQuery.isLoading;
  const isProductIdSearchError = productIdSearchQuery.isError;
  const isProductIdSearchFetching = productIdSearchQuery.isFetching;
  const productIdSearchError = productIdSearchQuery.error;

  const openInfoModal = (product: Product) => {
    setSelectedProduct(product);
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setInfoModalOpen(false);
    setSelectedProduct(null);
  };

  const showModal = () => {
    setProductPopupOpen(true);
  };
  const handleModalClose = () => {
    setProductPopupOpen(false);
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

      if (!listFromTextSearch && !isIdSearch) {
        const snapshot = useProductStore.getState().products;
        if (snapshot) {
          queryClient.setQueryData([...productsPaginatedQueryKey], snapshot);
        }
      }

      message.success('Продукт успешно добавлен!');
      setProductPopupOpen(false);
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

  const clearTableSearchView = () => {
    setListFromTextSearch(false);
    setIsIdSearch(false);
    setSelectedId(null);
    setSearchText('');
  };

  const dataSource = isIdSearch
    ? productIdSearchQuery.data
      ? [productIdSearchQuery.data]
      : []
    : listFromTextSearch
      ? productSearchQuery.data?.products || []
      : productsPageQuery.data?.products || [];

  const effectiveTotal = isIdSearch
    ? 1
    : listFromTextSearch
      ? (productSearchQuery.data?.total ?? 0)
      : (productsPageQuery.data?.total ?? 0);

  const displayError = isIdSearch
    ? isProductIdSearchError
      ? getQueryErrorMessage(productIdSearchError)
      : null
    : listFromTextSearch
      ? isProductsSearchError
        ? getQueryErrorMessage(productsSearchError)
        : null
      : isProductsPageError
        ? getQueryErrorMessage(productsPageError)
        : null;

  const tableLoading = isIdSearch
    ? isProductIdSearchPending || isProductIdSearchLoading || isProductIdSearchFetching
    : listFromTextSearch
      ? isProductsSearchPending || isProductsSearchLoading || isProductsSearchFetching
      : isProductsPagePending || isProductsPageLoading || isProductsPageFetching;

  const tableEmptyText = (() => {
    if (tableLoading) return 'Загрузка…';
    if (isIdSearch && displayError) return displayError;
    if (displayError) return `Не удалось загрузить данные: ${displayError}`;
    if (isIdSearch && dataSource.length === 0) return 'Товар не найден';
    if (listFromTextSearch && dataSource.length === 0) return 'Ничего не найдено';
    if (!listFromTextSearch && !isIdSearch && dataSource.length === 0) return 'Нет данных';
    return '';
  })();

  const sorterForTable: SorterResult<Product> =
    sortedInfo ??
    ({
      columnKey: undefined,
      order: null,
    } as unknown as SorterResult<Product>);

  const handleTableChange: TableProps<Product>['onChange'] = (
    newPagination,
    _filters,
    sorter,
    _extra
  ) => {
    clearTableSearchView();

    if (!Array.isArray(sorter) && sorter && sorter.order) {
      setSortedInfo(sorter);
      localStorage.setItem('sortOrder', JSON.stringify(sorter));
    } else {
      setSortedInfo(null);
      localStorage.removeItem('sortOrder');
    }

    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? pagination.pageSize,
    });

    localStorage.setItem('tablePageSize', String(newPagination.pageSize));
  };

  const paginationConfig = {
    className: 'custom-pagination',
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: effectiveTotal,
    showQuickJumper: false,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    onChange: (page: number, pageSize: number) => {
      clearTableSearchView();
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
    clearTableSearchView();
    void productsPageQuery.refetch();
  };

  const handleSearch = (data: string) => {
    const numericId = Number(data);
    setPagination((prev) => ({ ...prev, current: 1 }));
    if (!isNaN(numericId) && numericId > 0) {
      setListFromTextSearch(false);
      setSelectedId(numericId.toString());
      setIsIdSearch(true);
      setSearchText('');
    } else if (data.length > 0 || data.trim() !== '') {
      setSelectedId(null);
      setListFromTextSearch(true);
      setIsIdSearch(false);
      setSearchText(data);
    } else {
      setSelectedId(null);
      setListFromTextSearch(false);
      setIsIdSearch(false);
      setSearchText('');
    }
  };

  return (
    <Flex vertical gap={30}>
      <Flex
        className="table-search"
        justify="space-between"
        align="center"
        style={{ width: '100%' }}
        gap={20}
      >
        <Text className="search-title" style={{ textAlign: 'left', flex: '0 0 auto' }}>
          Товары
        </Text>

        <ProductSearch ref={searchQuoteRef} onSearch={(value: string) => handleSearch(value)} />
      </Flex>

      <Flex vertical gap={0} style={{ width: '100%' }}>
        <Flex justify="space-between" gap={0}>
          <Title className="table-title">
            Все позиции: {effectiveTotal > 0 ? effectiveTotal : '0'}
          </Title>
          <Flex gap={8}>
            <Button
              icon={<RefreshIcon />}
              className="table-refresh-btn"
              onClick={handleRefresh}
            ></Button>
            <Button type="primary" icon={<AddIcon />} className="table-add-btn" onClick={showModal}>
              Добавить
            </Button>
          </Flex>
        </Flex>

        <Skeleton active loading={tableLoading} paragraph={{ rows: 6 }}>
          <ProductTable
            emptyText={tableEmptyText}
            isLoading={false}
            onOpenInfoModal={openInfoModal}
            data={dataSource}
            sortedInfo={sorterForTable}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            paginationConfig={paginationConfig}
          />
        </Skeleton>
      </Flex>

      <Modal
        centered={true}
        title="Добавить товар"
        closable={true}
        open={poductPopupOpen}
        onCancel={handleModalClose}
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
            name="title"
            rules={[
              { required: true, message: 'Обязательное поле' },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,25}$/,
                message: 'Буквы, цифры и знаки препинания',
              },
            ]}
          >
            <Input placeholder="Наименование" />
          </Form.Item>

          <Form.Item
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
              <Button type="default" htmlType="reset" onClick={handleReset}>
                Сбросить
              </Button>
              <Button type="primary" htmlType="submit">
                Добавить
              </Button>
            </Flex>
            <Button type="default" onClick={handleModalClose}>
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
                  return <Image src={image} key={key} alt="pic" width={300} height={300} />;
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
    </Flex>
  );
};

export { TablePage };
