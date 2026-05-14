import { Button, Flex } from 'antd';

import { cardStyle } from '../../../../shared/styles/shell';
import { InfoTitle } from '../../../../shared/ui/InfoTitle/InfoTitle';

import type { TableCategoriesBlockProps } from './types';
const TableCategoriesBlock: React.FC<TableCategoriesBlockProps> = ({
  categoryOptions,
  handleAllCategoriesClick,
  handleCategoryClick,
  filters,
  themeMode,
}) => {
  return (
    <Flex vertical gap={6} style={cardStyle(themeMode)}>
      <InfoTitle title="Категории" subtitle="Выберите категорию для фильтрации" />
      <Flex gap={6} wrap="wrap" justify="center" align="center" style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleAllCategoriesClick}>
          Все категории
        </Button>

        {categoryOptions.length > 0 &&
          categoryOptions.map(({ value, label }) => {
            return (
              <Button
                key={value}
                aria-label={label}
                onClick={() => handleCategoryClick(value)}
                className={filters.category === value ? 'table-category-btn-active' : ''}
              >
                {label}
              </Button>
            );
          })}
      </Flex>
    </Flex>
  );
};
export { TableCategoriesBlock };
