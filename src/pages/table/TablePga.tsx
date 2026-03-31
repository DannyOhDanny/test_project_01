import React from 'react';
import { Typography, Space } from 'antd';

const { Title } = Typography;

const TablePage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}> Таблица</Title>
    </Space>
  );
};

export { TablePage };
