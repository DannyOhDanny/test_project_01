import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest'; // ← добавляем vi

import { formatPrice } from '../../../../shared/functions/productFunctions';
import type { Dimensions, Meta, Product, Review } from '../../model/types';

import { ProductTable } from './ProductTable';

vi.mock('../../../../shared/functions/productFunctions', () => ({
  formatPrice: vi.fn((value) => `${value},00`),
  getCategory: vi.fn((category) => `mapped-${category}`),
  getRatingColor: vi.fn((rating) => (rating < 3 ? 'red' : 'black')),
}));

const exampleDimensions: Dimensions = { width: 10, height: 20, depth: 5 };
const exampleReview: Review = {
  rating: 2,
  comment: 'comment',
  date: '2026-03-17',
  reviewerName: 'John',
  reviewerEmail: 'test@test.com',
};
const exampleMeta: Meta = {
  createdAt: '2024-01-01',
  updatedAt: '2024-01-10',
  barcode: 'dhdhdh',
  qrCode: 'djddjjd',
};

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description 1',
    category: 'electronics',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    tags: ['tag1', 'tag2'],
    brand: 'Brand A',
    sku: 'SKU001',
    weight: 1.5,
    dimensions: exampleDimensions,
    warrantyInformation: '2 years warranty',
    shippingInformation: 'Ships worldwide',
    availabilityStatus: 'In Stock',
    reviews: [exampleReview],
    returnPolicy: '30 days return',
    minimumOrderQuantity: 1,
    meta: exampleMeta,
    thumbnail: 'thumbnail1.png',
    images: ['img1.png', 'img2.png'],
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description 2',
    category: 'books',
    price: 50,
    discountPercentage: 5,
    rating: 2,
    stock: 100,
    tags: ['tag3'],
    brand: 'Brand B',
    sku: 'SKU002',
    weight: 0.5,
    dimensions: exampleDimensions,
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships locally',
    availabilityStatus: 'Limited Stock',
    reviews: [],
    returnPolicy: '14 days return',
    minimumOrderQuantity: 1,
    meta: exampleMeta,
    thumbnail: 'thumbnail2.png',
    images: ['img3.png', 'img4.png'],
  },
];

describe('ProductTable', () => {
  it('рендерит таблицу с данными', () => {
    render(
      <ProductTable
        data={mockProducts}
        sortedInfo={{
          column: {
            title: 'Цена, ₽',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortOrder: 'descend',
            ellipsis: true,
            align: 'center',
          },
          order: 'descend',
          field: 'price',
          columnKey: 'price',
        }}
        onChange={vi.fn()}
        rowSelection={undefined}
        paginationConfig={{
          current: 1,
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10'],
          onChange: vi.fn(),
        }}
        onOpenInfoModal={vi.fn()}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();

    expect(screen.getByText('mapped-electronics')).toBeInTheDocument();
    expect(screen.getByText('mapped-books')).toBeInTheDocument();
  });

  it('показывает рейтинг с правильным цветом', () => {
    render(
      <ProductTable
        data={mockProducts}
        sortedInfo={{
          column: {
            title: 'Цена, ₽',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortOrder: 'descend',
            ellipsis: true,
            align: 'center',
          },
          order: 'descend',
          field: 'price',
          columnKey: 'price',
        }}
        onChange={vi.fn()}
        rowSelection={undefined}
        paginationConfig={{
          current: 1,
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10'],
          onChange: vi.fn(),
        }}
        onOpenInfoModal={vi.fn()}
      />
    );

    const ratings = screen.getAllByText(/\/5$/);

    expect(ratings[0].firstChild).toHaveStyle('color:rgb(0,0,0)');
    expect(ratings[1].firstChild).toHaveStyle('color: rgb(255,0,0)');
  });

  it('форматирует цену через formatPrice', () => {
    render(
      <ProductTable
        data={mockProducts}
        sortedInfo={{
          column: {
            title: 'Цена, ₽',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortOrder: 'descend',
            ellipsis: true,
            align: 'center',
          },
          order: 'descend',
          field: 'price',
          columnKey: 'price',
        }}
        onChange={vi.fn()}
        rowSelection={undefined}
        paginationConfig={{
          current: 1,
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10'],
          onChange: vi.fn(),
        }}
        onOpenInfoModal={vi.fn()}
      />
    );

    expect(formatPrice).toHaveBeenCalledWith(mockProducts[0].price * 10000);
    expect(formatPrice).toHaveBeenCalledWith(mockProducts[1].price * 10000);
  });

  it('вызывает onOpenInfoModal при клике на AddIcon', () => {
    const openModalMock = vi.fn();
    render(
      <ProductTable
        data={mockProducts}
        sortedInfo={{
          column: {
            title: 'Цена, ₽',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortOrder: 'descend',
            ellipsis: true,
            align: 'center',
          },
          order: 'descend',
          field: 'price',
          columnKey: 'price',
        }}
        onChange={vi.fn()}
        rowSelection={undefined}
        paginationConfig={{
          current: 1,
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10'],
          onChange: vi.fn(),
        }}
        onOpenInfoModal={openModalMock}
      />
    );

    const addButtons = screen.getAllByRole('button');
    fireEvent.click(addButtons[0]);
    expect(openModalMock).toHaveBeenCalledWith(mockProducts[0]);
  });
});
