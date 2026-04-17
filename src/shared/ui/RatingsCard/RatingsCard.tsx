import React from 'react';
import { Card, Select, Space, Table, Typography } from 'antd';

import type { RatingsCardProps } from './model/types';

import './styles.css';
const { Text } = Typography;

const RatingsCard: React.FC<RatingsCardProps> = ({
  data,
  title,
  options,
  tag,
  emptyText,
  columns,
  selectedStat,
  onSelectStat,
  loading,
  countText,
}) => (
  <Card
    variant="borderless"
    title={
      <Space wrap size={8}>
        {title}
        {tag}
      </Space>
    }
    extra={
      <Space size={12} wrap align="center">
        {countText ? <Text type="secondary">{countText}</Text> : null}
        <Select
          options={options}
          value={selectedStat}
          onChange={onSelectStat}
          style={{ minWidth: 220 }}
          size="middle"
        />
      </Space>
    }
    styles={{
      header: {
        paddingBlock: 16,
        paddingInline: 20,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        background: 'linear-gradient(180deg, #fafafc 0%, #ffffff 100%)',
      },
      body: { margin: 20 },
    }}
    style={{
      borderRadius: 18,
      border: '1px solid rgba(5, 5, 5, 0.08)',
      background: '#ffffff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
    }}
  >
    <Table
      rowKey="id"
      size="small"
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={loading}
      locale={{ emptyText: emptyText ?? 'Нет данных' }}
      scroll={{ x: true }}
    />
  </Card>
);
export { RatingsCard };
