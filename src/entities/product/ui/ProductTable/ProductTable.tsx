import React from 'react';
import type { TableColumnsType } from 'antd';
import { Avatar, Button, Flex, Progress, Table, Typography } from 'antd';

import { getRandomStock, getStrkeColor } from '../../../../pages/table/utils/tableFunctions';
import AddIcon from '../../../../shared/assets/add-icon.svg?react';
// import DotsButton from '../../../../shared/assets/dots-icon.svg?react';
import {
  formatPrice,
  getCategory,
  getRatingColor,
} from '../../../../shared/functions/productFunctions';
import type { Product } from '../../model/types';

import type { ProductTableProps } from './model/types';

import './ProductTable.css';

const { Text } = Typography;

const ProductTable: React.FC<ProductTableProps> = ({
  emptyText,
  errorMessage,
  data,
  sortedInfo,
  onChange,
  rowSelection,
  paginationConfig,
  onOpenInfoModal,
  isLoading,
}) => {
  const emptyStateText =
    emptyText && emptyText.length > 0
      ? emptyText
      : errorMessage && errorMessage.length > 0
        ? errorMessage
        : '';

  const tableColumns: TableColumnsType<Product> = [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: '200px',
      ellipsis: true,
      render: (_value, record) => (
        <Flex gap={10} align="center">
          <Avatar
            shape="square"
            src={record.thumbnail}
            alt="product-image"
            style={{
              backgroundColor: '#C4C4C4',
              width: '48px',
              height: '48px',
              alignSelf: 'center',
              justifySelf: 'center',
            }}
          />
          <Flex vertical align="center" gap={10} style={{ maxWidth: '150px', width: '100%' }}>
            <Text
              className="item-title"
              ellipsis={{ tooltip: record.title }}
              style={{ textAlign: 'center' }}
            >
              {record.title}{' '}
            </Text>
            <Text className="item-subtitle">{getCategory(record.category)}</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'Вендор',
      dataIndex: 'brand',
      key: 'brand',
      align: 'center',
      ellipsis: true,
      minWidth: 160,
      render: (_value, record) => (
        <Text
          style={{ maxWidth: '120px', width: '100%', textAlign: 'center' }}
          ellipsis={{ tooltip: record.brand }}
          className="brand-item"
        >
          {record.brand}
        </Text>
      ),
    },
    {
      title: 'Артикул',
      dataIndex: 'sku',
      key: 'sku',
      align: 'center',
      minWidth: 160,
      render: (_value, record) => <Text className="sku-item">{record.sku}</Text>,
    },
    {
      title: 'Склад',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
      minWidth: 160,
      render: (_value, record) => {
        {
          const stock = Math.max(record.stock, 0);
          const base = stock === 0 ? 1 : getRandomStock(stock, stock * 10 + 1);
          const percent = Math.round((stock / base) * 100);
          return (
            <Flex vertical gap={5}>
              <Text className="sku-item">{record.stock} шт</Text>
              <Progress
                type="line"
                steps={5}
                style={{ width: '100%', minWidth: '120px' }}
                strokeLinecap="butt"
                strokeWidth={5}
                format={(percent) => `${percent}%`}
                percent={percent}
                strokeColor={getStrkeColor(percent)}
                showInfo={true}
                styles={{
                  indicator: {
                    fontSize: 10,
                  },
                }}
              />
            </Flex>
          );
        }
      },
    },
    {
      title: 'Оценка',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
      sortOrder: sortedInfo?.columnKey === 'rating' ? sortedInfo.order : null,
      ellipsis: true,
      align: 'center',
      render: (_value, record) => (
        <Text>
          <Text className="sku-item" style={{ color: getRatingColor(record.rating) }}>
            {record.rating}
          </Text>
          /5
        </Text>
      ),
    },
    {
      title: 'Цена, ₽',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      sortOrder: sortedInfo?.columnKey === 'price' ? sortedInfo.order : null,
      ellipsis: true,
      align: 'center',
      render: (_value, record) => {
        const formattedPrice = formatPrice(record.price * 10000);
        const [integerPart, fractionalPart] = formattedPrice.split(',');
        return (
          <Text className="price-item">
            <span style={{ color: '#222' }}>{integerPart}</span>
            <span style={{ color: '#999' }}>,{fractionalPart}</span>
          </Text>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button
          aria-label="Открыть информацию о товаре"
          onClick={() => onOpenInfoModal(record)}
          style={{
            background: 'var(--bg-color)',
            boxShadow: 'none',
            width: '52px',
            height: '27px',
            padding: '4px',
            color: '#fff',
            border: 'none',
          }}
        >
          <AddIcon />
        </Button>
      ),
      align: 'center',
    },
    // {
    //   title: '',
    //   dataIndex: '',
    //   key: 'x',
    //   render: () => <Button style={{ border: 'none', boxShadow: 'none' }} icon={<DotsButton />} />,
    //   align: 'center',
    // },
  ];

  return (
    <>
      <Table
        locale={{
          emptyText:
            emptyStateText.length > 0 ? (
              <div role="status" aria-live="polite">
                {emptyStateText}
              </div>
            ) : undefined,
        }}
        loading={isLoading}
        rowKey="sku"
        dataSource={data}
        columns={tableColumns}
        onChange={onChange}
        rowSelection={rowSelection}
        style={{ marginTop: 20 }}
        scroll={{ x: 'max-content' }}
        tableLayout="auto"
        pagination={paginationConfig}
      />
    </>
  );
};

export { ProductTable };
