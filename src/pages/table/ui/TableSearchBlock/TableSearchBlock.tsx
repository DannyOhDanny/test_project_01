import { Button, Flex } from 'antd';

import { ProductSearch } from '../../../../entities/product/ui/ProductSearch/ProductSearch';
import RefreshIcon from '../../../../shared/assets/refresh-icon.svg?react';
import { cardStyle } from '../../../../shared/styles/shell';

import type { TableSearchBlockProps } from './types';

const TableSearchBlock: React.FC<TableSearchBlockProps> = ({
  searchQuoteRef,
  searchText,
  setSearchText,
  handleSearch,
  handleRefresh,
}) => {
  return (
    <Flex justify="space-between" gap={12} wrap="wrap" align="stretch">
      <Flex gap={8} align="center" wrap="wrap" style={cardStyle}>
        <ProductSearch
          ref={searchQuoteRef}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value: string) => handleSearch(value)}
        />
        <Button
          aria-label="Обновить список товаров"
          icon={<RefreshIcon />}
          className="table-refresh-btn"
          onClick={handleRefresh}
        ></Button>
      </Flex>
    </Flex>
  );
};
export { TableSearchBlock };
