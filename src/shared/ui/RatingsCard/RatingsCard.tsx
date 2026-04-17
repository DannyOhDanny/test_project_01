import React, { useMemo } from 'react';
import { Avatar, Card, List, Space, Tag, Typography } from 'antd';

import { formatPrice } from '../../functions/productFunctions';

import type { RatingsCardProps } from './model/types';
import { RANK_TAG_COLORS, TOP_STATS_LIMIT } from './utils/cardConfig';
import { sortProducts } from './utils/functions';
const { Text } = Typography;
import './styles.css';

const RatingsCard: React.FC<RatingsCardProps> = ({
  data,
  title,
  tag,
  sortBy,
  sortOrder,
  emptyText,
  renderDescription = (product) => <Text type="secondary">{formatPrice(product.price)} ₽</Text>,
}) => {
  const sorted = useMemo(
    () => sortProducts(data, sortBy, sortOrder).slice(0, TOP_STATS_LIMIT),
    [data, sortBy, sortOrder]
  );

  return (
    <Card
      variant="borderless"
      title={
        <Space wrap>
          {title}
          {tag}
        </Space>
      }
      extra={<Text type="secondary">{data.length} поз.</Text>}
      styles={{ body: { paddingTop: 8 } }}
      style={{
        borderRadius: 16,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={sorted}
        locale={{ emptyText }}
        renderItem={(product, index) => (
          <List.Item style={{ paddingInline: 0 }}>
            <List.Item.Meta
              avatar={<Avatar src={product.thumbnail} size={56} style={{ borderRadius: 10 }} />}
              title={
                <Space size={8} wrap>
                  <Tag color={RANK_TAG_COLORS[index % RANK_TAG_COLORS.length]}>#{index + 1}</Tag>
                  <Text strong ellipsis style={{ maxWidth: '100%' }}>
                    {product.title}
                  </Text>
                </Space>
              }
              description={renderDescription(product)}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export { RatingsCard };
