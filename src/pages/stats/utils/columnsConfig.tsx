import type { TableColumnsType } from 'antd';
import { Typography } from 'antd';
import { Flex, Image, Rate } from 'antd';

import type { Product } from '../../../entities/product/model/types';
import { formatPrice } from '../../../shared/functions/productFunctions';

const { Text } = Typography;

export const columns: TableColumnsType<Product> = [
  {
    title: '№',
    dataIndex: 'index',
    key: 'index',
    render: (_value: number, _record: Product, index: number) => index + 1,
  },
  {
    title: 'Наименование',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Цена',
    dataIndex: 'price',
    key: 'price',
    sorter: (a: Product, b: Product) => a.price - b.price,
    render: (_value: number, record: Product) => (
      <Text type="secondary">{formatPrice(record.price * 1000)} ₽</Text>
    ),
  },
  {
    title: 'Рейтинг',
    dataIndex: 'rating',
    key: 'rating',
    sorter: (a: Product, b: Product) => a.rating - b.rating,
    render: (_value: number, record: Product) => (
      <Flex gap={40}>
        <Rate disabled allowHalf value={record.rating} style={{ fontSize: 14 }} />
        <Text>{record.rating}/5</Text>
      </Flex>
    ),
  },

  {
    title: 'Вендор',
    dataIndex: 'brand',
    key: 'brand',
  },

  {
    title: 'Изображение',
    dataIndex: 'thumbnail',
    key: 'thumbnail',
    render: (text: string) => <Image src={text} width={50} height={50} alt="product-image" />,
  },
];
