import './TablePage.css';
import React, { useEffect, useState, useRef } from 'react';
import { Typography, Table, Button, Avatar, Flex, Progress, Alert, Input } from 'antd';
import { useProductStore } from '../../entities/product/model/productStore';
import type { TableColumnsType, TableProps } from 'antd';
import { Product } from '../../entities/product/model/types';
import DotsButton from '../../shared/assets/dots-icon.svg?react';
import AddIcon from '../../shared/assets/add-icon.svg?react';
import RefreshIcon from '../../shared/assets/refresh-icon.svg?react';
import SearchIcon from '../../shared/assets/search-icon.svg?react';

import type { SorterResult } from 'antd/es/table/interface';
import type { GetProps } from 'antd';
import { createStaticStyles } from 'antd-style';

const { Title, Text } = Typography;
const { Search } = Input;

type SearchProps = GetProps<typeof Input.Search>;

const styles = createStaticStyles(({ css, cssVar }) => ({
  focusEffect: css`
    border-width: ${cssVar.lineWidth};
    border-radius: ${cssVar.borderRadius};
    transition: box-shadow ${cssVar.motionDurationMid};
    &:hover {
      border: 1px solid #d9d9d9;
    }
    &:focus-visible {
      border-color: lab(66.128% 0 0);
      box-shadow: 0 0 0 4px color-mix(in oklab, lab(66.128% 0 0) 50%, transparent);
    }
  `,
}));

const stylesFnSearch: SearchProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: { color: 'var(--bg-color)' },
      input: { color: 'var(--bg-color)', borderColor: 'transparent', backgroundColor: '#f3f3f3' },
      prefix: { color: 'var(--bg-color)' },
      count: { color: 'var(--bg-color)' },
      button: {
        root: { color: 'transparent', borderColor: 'transparent', display: 'none' },
      },
    } satisfies SearchProps['styles'];
  }
  return {};
};
const categoryMap: Record<string, string> = {
  beauty: 'красота',
  fragrances: 'парфюмерия',
  furniture: 'мебель',
  groceries: 'бакалея',
  'home-decoration': 'декор для дома',
  'kitchen-accessories': 'аксессуары для кухни',
  laptops: 'ноутбуки',
  'mens-shirts': 'мужские рубашки',
  'mens-shoes': 'мужская обувь',
  'mens-watches': 'мужские часы',
  'mobile-accessories': 'аксессуары для мобильных',
  motorcycle: 'мотоциклы',
  'skin-care': 'уход за кожей',
  smartphones: 'смартфоны',
  'sports-accessories': 'спортивные аксессуары',
  sunglasses: 'солнцезащитные очки',
  tablets: 'планшеты',
  tops: 'топы',
  vehicle: 'транспорт',
  'womens-bags': 'женские сумки',
  'womens-dresses': 'женские платья',
  'womens-jewellery': 'женские украшения',
  'womens-shoes': 'женская обувь',
  'womens-watches': 'женские часы',
};

function getCategory(category: string): string {
  return categoryMap[category] || category;
}

function getRatingColor(rating: number): string {
  const ratingNumber = rating;
  if (isNaN(ratingNumber)) return 'grey';
  if (ratingNumber < 3.5) return 'red';
  return 'black';
}

export const formatPrice = (value: number | string): string => {
  if (value === null || value === undefined || value === '') return '';

  const numberValue =
    typeof value === 'string' ? Number(value.replace(/\s/g, '').replace(',', '.')) : value;

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

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
  } = useProductStore();
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Product>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const classNames = styles;
  const searchQuoteRef = useRef(null);

  const handleTableChange: TableProps<Product>['onChange'] = (_, __, sorter) => {
    if (Array.isArray(sorter)) {
      setSortedInfo(sorter[0]);
    } else {
      setSortedInfo(sorter);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
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
      sorter: (a, b) => a.rating - b.rating,
      sortOrder: sortedInfo.columnKey === 'rating' ? sortedInfo.order : null,
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
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
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
      render: () => (
        <Button
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
  const dataSource = searchProduct ? [searchProduct] : products?.products || [];
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

        <Flex justify="center" style={{ flex: 1 }}>
          <Search
            ref={searchQuoteRef}
            onSearch={(value: string) => handleSearch(value)}
            prefix={<SearchIcon />}
            classNames={classNames}
            styles={stylesFnSearch}
            size="large"
            placeholder="Найти"
            name="search-fn"
            allowClear={false}
            style={{ maxWidth: '1023px', width: '100%' }}
          />
        </Flex>
      </Flex>
      <Flex orientation="vertical" gap={0} style={{ width: '100%' }}>
        <Flex justify="space-between" gap={0}>
          <Title className="table-title">Все позиции</Title>
          <Flex gap={10}>
            <Button
              icon={<RefreshIcon />}
              className="table-refresh-btn"
              onClick={handleRefresh}
            ></Button>
            <Button type="primary" icon={<AddIcon />} className="table-add-btn">
              Добавить
            </Button>
          </Flex>
        </Flex>
        {isLoading && (
          <Progress
            percent={progress}
            type="line"
            showInfo
            strokeColor={{
              '0%': '#fff',
              '100%': '#242edb',
            }}
            strokeLinecap="round"
            style={{ margin: '20px' }}
          />
        )}{' '}
        {dataSource.length > 0 && (
          <Table
            rowKey="title"
            styles={{
              root: { marginTop: '40px' },
              header: {
                cell: {
                  fontFamily: 'var(--font-family)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#b2b3b9',
                  background: 'transparent',
                },
              },
            }}
            tableLayout="auto"
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={tableColumns}
            onChange={handleTableChange}
          />
        )}
      </Flex>
    </Flex>
  );
};

export { TablePage };
