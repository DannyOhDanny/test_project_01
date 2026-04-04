import React, { useEffect, useRef, useState } from 'react';
import type { TableProps } from 'antd';
import type { FormProps } from 'antd';
import {
  Alert,
  Button,
  Carousel,
  Descriptions,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Progress,
  Table,
  Typography,
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import { useProductStore } from '../../entities/product/model/productStore';
import { type Product } from '../../entities/product/model/types';
import { ProductSearch } from '../../entities/product/ui/ProductSearch/ProductSearch';
import { ProductTable } from '../../entities/product/ui/ProductTable/ProductTable';
import AddIcon from '../../shared/assets/add-icon.svg?react';
import RefreshIcon from '../../shared/assets/refresh-icon.svg?react';

import './TablePage.css';

const { Title, Text } = Typography;

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
  const {
    products,
    total,
    isLoading,
    error,
    progress,
    searchProducts,
    getProductById,
    searchProduct,
    addProduct,
    getProductsByPage,
  } = useProductStore();

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
  const [poductPopupOpen, setProductPopupOpen] = useState<boolean>(false);
  const [form] = Form.useForm<ProductFormFieldsType>();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: Number(localStorage.getItem('tablePageSize')) || 5,
  });

  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openInfoModal = (product: Product) => {
    setSelectedProduct(product);
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setInfoModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const savedSort = getInitialSort();
    let sortBy: string | undefined;
    let order: 'asc' | 'desc' | undefined;
    if (savedSort && savedSort.order) {
      sortBy = savedSort.columnKey?.toString();
      order = savedSort.order === 'ascend' ? 'asc' : 'desc';
    }
    const skip = (pagination.current - 1) * pagination.pageSize;
    getProductsByPage(pagination.pageSize, skip, sortBy, order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const dataSource = searchProduct ? [searchProduct] : products?.products || [];

  const handleTableChange: TableProps<Product>['onChange'] = (
    newPagination,
    _filters,
    sorter,
    _extra
  ) => {
    let sortBy: string | undefined;
    let order: 'asc' | 'desc' | undefined;

    if (!Array.isArray(sorter) && sorter && sorter.order) {
      sortBy = sorter.columnKey?.toString();
      order = sorter.order === 'ascend' ? 'asc' : 'desc';
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

    const skip =
      ((newPagination.current ?? 1) - 1) * (newPagination.pageSize ?? pagination.pageSize);
    getProductsByPage(newPagination.pageSize ?? pagination.pageSize, skip, sortBy, order);
  };

  const paginationConfig = {
    className: 'custom-pagination',
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: total,
    showQuickJumper: false,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    onChange: (page: number, pageSize: number) => {
      setPagination({ current: page, pageSize });
      const skip = (page - 1) * pageSize;
      let sortBy: string | undefined;
      let order: 'asc' | 'desc' | undefined;
      if (sortedInfo && sortedInfo.order) {
        sortBy = sortedInfo.columnKey?.toString();
        order = sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }
      getProductsByPage(pageSize, skip, sortBy, order);
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
    const skip = (pagination.current - 1) * pagination.pageSize;
    let sortBy: string | undefined;
    let order: 'asc' | 'desc' | undefined;
    if (sortedInfo && sortedInfo.order) {
      sortBy = sortedInfo.columnKey?.toString();
      order = sortedInfo.order === 'ascend' ? 'asc' : 'desc';
    }
    getProductsByPage(pagination.pageSize, skip, sortBy, order);
  };

  const handleSearch = (data: string) => {
    const numericId = Number(data);
    setPagination((prev) => ({ ...prev, current: 1 }));
    if (!isNaN(numericId) && numericId > 0) {
      getProductById(numericId.toString());
    } else {
      searchProducts(data);
    }
  };

  if (error) return <Alert type="error" title={'Ошибка'} description={error} />;

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
      <Flex orientation="vertical" gap={0} style={{ width: '100%' }}>
        <Flex justify="space-between" gap={0}>
          <Title className="table-title">Все позиции</Title>
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
        <Flex style={{ height: '20px' }}>
          {isLoading && (
            <Progress
              percent={progress}
              type="line"
              strokeColor={{
                '0%': '#fff',
                '100%': '#242edb',
              }}
              strokeLinecap="round"
              style={{ margin: '20px' }}
            />
          )}{' '}
        </Flex>
        {dataSource.length > 0 && (
          <ProductTable
            onOpenInfoModal={openInfoModal}
            data={dataSource}
            sortedInfo={sortedInfo!}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            paginationConfig={paginationConfig}
          />
        )}
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
