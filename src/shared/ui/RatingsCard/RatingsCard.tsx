import React from 'react';
import { Card, Select, Space, Table, Typography } from 'antd';

import { cardShellStyle } from '../../../shared/styles/shell';

import type { RatingsCardProps } from './model/types';

import './styles.css';
const { Text } = Typography;

const RatingsCard: React.FC<RatingsCardProps> = ({
  themeMode,
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
      },
      body: { margin: 20 },
    }}
    style={{
      width: '100%',
      minWidth: 0,
      ...cardShellStyle(themeMode),
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
