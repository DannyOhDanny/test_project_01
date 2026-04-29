import { Button, Flex, Typography } from 'antd';

import { cardStyle } from '../../../shared/styles/shell';
import type { TableCategoriesBlockProps } from '../model/types';
const { Title, Text } = Typography;

const TableCategoriesBlock: React.FC<TableCategoriesBlockProps> = ({
  categoryOptions,
  handleAllCategoriesClick,
  handleCategoryClick,
  filters,
}) => {
  return (
    <Flex vertical gap={6} style={cardStyle}>
      <Title level={4} className="table-title">
        Категории
      </Title>
      <Text className="table-text">Выберите категорию для фильтрации</Text>
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
