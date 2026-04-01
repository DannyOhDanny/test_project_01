import React, { useEffect, useRef, useState } from 'react';
import type { TableProps } from 'antd';
import type { FormProps } from 'antd';
import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Table,
  Typography,
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import { useProductStore } from '../../entities/product/model/productStore';
import { Product } from '../../entities/product/model/types';
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
    getProducts,
    isLoading,
    error,
    progress,
    searchProducts,
    getProductById,
    searchProduct,
    addProduct,
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

  const handleTableChange: TableProps<Product>['onChange'] = (_, __, sorter) => {
    let sortToStore: SorterResult<Product> | SorterResult<Product>[] | null = null;

    if (Array.isArray(sorter)) {
      sortToStore = sorter;
      setSortedInfo(sorter[0] || null);
    } else if (sorter && sorter.order) {
      sortToStore = sorter;
      setSortedInfo(sorter || null);
    } else {
      sortToStore = null;
      setSortedInfo(null);
    }

    localStorage.setItem('sortOrder', JSON.stringify(sortToStore));
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
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleRefresh = () => {
    getProducts();
  };

  const handleSearch = (data: string) => {
    const numericId = Number(data);

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
        {dataSource.length > 0 && (
          <ProductTable
            data={dataSource}
            sortedInfo={sortedInfo!}
            onChange={handleTableChange}
            rowSelection={rowSelection}
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
    </Flex>
  );
};

export { TablePage };
