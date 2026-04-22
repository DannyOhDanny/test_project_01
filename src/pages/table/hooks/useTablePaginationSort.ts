import { useState } from 'react';
import type { TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

export function useTablePaginationSort<T extends object>() {
  const getInitialSort = (): SorterResult<T> | null => {
    const saved = localStorage.getItem('sortOrder');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  };

  const [sortedInfo, setSortedInfo] = useState<SorterResult<T> | null>(getInitialSort);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: Number(localStorage.getItem('tablePageSize')) || 5,
  });

  const pageSkip = (pagination.current - 1) * pagination.pageSize;

  const apiSortBy = sortedInfo?.order ? sortedInfo.columnKey?.toString() : undefined;
  const apiOrder: 'asc' | 'desc' | undefined = sortedInfo?.order
    ? sortedInfo.order === 'ascend'
      ? 'asc'
      : 'desc'
    : undefined;

  const handleTableChange: TableProps<T>['onChange'] = (newPagination, _filters, sorter) => {
    // сортировка
    if (!Array.isArray(sorter) && sorter?.order) {
      setSortedInfo(sorter);
      localStorage.setItem('sortOrder', JSON.stringify(sorter));
    } else {
      setSortedInfo(null);
      localStorage.removeItem('sortOrder');
    }

    // пагинация
    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? pagination.pageSize,
    });

    localStorage.setItem('tablePageSize', String(newPagination.pageSize ?? pagination.pageSize));
  };

  return {
    pagination,
    setPagination,
    pageSkip,
    sortedInfo,
    apiSortBy,
    apiOrder,
    handleTableChange,
  };
}
