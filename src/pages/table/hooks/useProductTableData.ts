import { useMemo } from 'react';

import { useProductByCategoryQuery } from '../../../entities/product/api/useProductByCategoryQuery';
import { useProductByIdQuery } from '../../../entities/product/api/useProductByIdQuery';
import { useProductPageQuery } from '../../../entities/product/api/useProductPageQuery';
import { useProductSearchQuery } from '../../../entities/product/api/useProductSearchQuery';
import type { Product, Products } from '../../../entities/product/model/types';
import type { FiltersPropsType, ViewModeType } from '../model/types';
import { getQueryErrorMessage } from '../utils/tableFunctions';

export const useProductsTableData = (
  viewMode: ViewModeType,
  filters: FiltersPropsType,
  isAuthenticated: boolean,
  pageSize: number,
  pageSkip: number,
  sortBy?: string,
  order?: 'asc' | 'desc'
) => {
  const selectedCategory = viewMode === 'category' ? (filters.category ?? null) : null;
  const selectedId = viewMode === 'id' ? (filters.id ?? null) : null;

  const listFromTextSearch = viewMode === 'text';
  const normalizedQuery = listFromTextSearch ? (filters.query ?? '').trim().toLowerCase() : '';

  const productCategoryQuery = useProductByCategoryQuery(selectedCategory ?? '');

  const productSearchQuery = useProductSearchQuery({
    isAuthenticated,
    listFromTextSearch,
    query: normalizedQuery,
  });

  const productIdSearchQuery = useProductByIdQuery({
    isAuthenticated,
    selectedId,
    listFromTextSearch,
  });

  const productsPageQuery = useProductPageQuery({
    isAuthenticated,
    listFromTextSearch,
    selectedId,
    selectedCategory,
    pageSize,
    pageSkip,
    sortBy,
    order,
  });

  return useMemo(() => {
    const buildEmptyText = ({
      loading,
      errorMessage,
      dataLength,
    }: {
      loading: boolean;
      errorMessage: string | null;
      dataLength: number;
    }) => {
      if (loading) return 'Загрузка…';
      if (errorMessage) {
        return viewMode === 'id' ? errorMessage : `Не удалось загрузить данные: ${errorMessage}`;
      }

      if (dataLength === 0) {
        switch (viewMode) {
          case 'id':
            return 'Товар не найден';
          case 'text':
            return 'Ничего не найдено';
          case 'category':
            return 'В этой категории нет данных';
          case 'page':
          default:
            return 'Нет данных';
        }
      }

      return '';
    };

    switch (viewMode) {
      case 'id': {
        const data: Product[] = productIdSearchQuery.data ? [productIdSearchQuery.data] : [];
        const total = productIdSearchQuery.data ? 1 : 0;
        const loading =
          productIdSearchQuery.isPending ||
          productIdSearchQuery.isLoading ||
          productIdSearchQuery.isFetching;
        const error = productIdSearchQuery.isError ? productIdSearchQuery.error : null;
        const errorMessage = error ? getQueryErrorMessage(error) : null;
        const emptyText = buildEmptyText({ loading, errorMessage, dataLength: data.length });
        return {
          data,
          total,
          loading,
          error,
          errorMessage,
          emptyText,
          refetch: productIdSearchQuery.refetch,
        };
      }
      case 'text': {
        const res = productSearchQuery.data as Products | null | undefined;
        const data = res?.products ?? [];
        const total = res?.total ?? 0;
        const loading =
          productSearchQuery.isPending ||
          productSearchQuery.isLoading ||
          productSearchQuery.isFetching;
        const error = productSearchQuery.isError ? productSearchQuery.error : null;
        const errorMessage = error ? getQueryErrorMessage(error) : null;
        const emptyText = buildEmptyText({ loading, errorMessage, dataLength: data.length });
        return {
          data,
          total,
          loading,
          error,
          errorMessage,
          emptyText,
          refetch: productSearchQuery.refetch,
        };
      }
      case 'category': {
        const res = productCategoryQuery.data as Products | null | undefined;
        const data = res?.products ?? [];
        const total = res?.total ?? 0;
        const loading =
          productCategoryQuery.isPending ||
          productCategoryQuery.isLoading ||
          productCategoryQuery.isFetching;
        const error = productCategoryQuery.isError ? productCategoryQuery.error : null;
        const errorMessage = error ? getQueryErrorMessage(error) : null;
        const emptyText = buildEmptyText({ loading, errorMessage, dataLength: data.length });
        return {
          data,
          total,
          loading,
          error,
          errorMessage,
          emptyText,
          refetch: productCategoryQuery.refetch,
        };
      }
      case 'page':
      default: {
        const res = productsPageQuery.data as Products | null | undefined;
        const data = res?.products ?? [];
        const total = res?.total ?? 0;
        const loading =
          productsPageQuery.isPending ||
          productsPageQuery.isLoading ||
          productsPageQuery.isFetching;
        const error = productsPageQuery.isError ? productsPageQuery.error : null;
        const errorMessage = error ? getQueryErrorMessage(error) : null;
        const emptyText = buildEmptyText({ loading, errorMessage, dataLength: data.length });
        return {
          data,
          total,
          loading,
          error,
          errorMessage,
          emptyText,
          refetch: productsPageQuery.refetch,
        };
      }
    }
  }, [
    viewMode,
    productIdSearchQuery.data,
    productIdSearchQuery.error,
    productIdSearchQuery.isError,
    productIdSearchQuery.isFetching,
    productIdSearchQuery.isLoading,
    productIdSearchQuery.isPending,
    productIdSearchQuery.refetch,
    productSearchQuery.data,
    productSearchQuery.error,
    productSearchQuery.isError,
    productSearchQuery.isFetching,
    productSearchQuery.isLoading,
    productSearchQuery.isPending,
    productSearchQuery.refetch,
    productCategoryQuery.data,
    productCategoryQuery.error,
    productCategoryQuery.isError,
    productCategoryQuery.isFetching,
    productCategoryQuery.isLoading,
    productCategoryQuery.isPending,
    productCategoryQuery.refetch,
    productsPageQuery.data,
    productsPageQuery.error,
    productsPageQuery.isError,
    productsPageQuery.isFetching,
    productsPageQuery.isLoading,
    productsPageQuery.isPending,
    productsPageQuery.refetch,
  ]);
};
