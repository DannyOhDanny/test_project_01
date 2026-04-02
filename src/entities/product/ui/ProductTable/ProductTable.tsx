import React from 'react';
import type { TableColumnsType } from 'antd';
import { Avatar, Button, Flex, Table, Typography } from 'antd';

import AddIcon from '../../../../shared/assets/add-icon.svg?react';
import DotsButton from '../../../../shared/assets/dots-icon.svg?react';
import {
  formatPrice,
  getCategory,
  getRatingColor,
} from '../../../../shared/functions/productFunctions';
import { Product } from '../../model/types';

import type { ProductTableProps } from './model/types';

import './ProductTable.css';

const { Text } = Typography;

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  sortedInfo,
  onChange,
  rowSelection,
  paginationConfig,
  onOpenInfoModal,
}) => {
  const tableColumns: TableColumnsType<Product> = [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: 330,
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
          <Flex vertical align="flex-start" gap={10}>
            <Text className="item-title">{record.title}</Text>
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
      render: (_value, record) => <Text className="brand-item">{record.brand}</Text>,
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
      title: 'Оценка',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
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
      sorter: true,
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
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: () => <Button style={{ border: 'none', boxShadow: 'none' }} icon={<DotsButton />} />,
      align: 'center',
    },
  ];

  return (
    <>
      <Table
        rowKey="sku"
        styles={{
          root: { marginTop: '40px' },
          header: {
            cell: {
              fontFamily: 'var(--font-family)',
              fontWeight: 600,
              fontSize: '16px',
              color: '#b2b3b9',
              background: 'transparent',
            },
          },
        }}
        tableLayout="auto"
        dataSource={data}
        columns={tableColumns}
        onChange={onChange}
        rowSelection={rowSelection}
        style={{ marginTop: 40 }}
        scroll={{ x: 'max-content' }}
        pagination={paginationConfig}
      />
    </>
  );
};

export { ProductTable };
