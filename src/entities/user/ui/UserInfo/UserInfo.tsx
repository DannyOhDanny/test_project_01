import React from 'react';
import { Avatar, Card, Descriptions, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserStore } from '../../model/userStore';

const { Title } = Typography;

export const UserInfo: React.FC = () => {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center">
          <Avatar size={64} src={user.image} icon={<UserOutlined />} />
          <Title level={3}>
            {user.firstName} {user.lastName}
          </Title>
        </Space>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
          {user.age && <Descriptions.Item label="Age">{user.age}</Descriptions.Item>}
          {user.phone && <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>}
        </Descriptions>
      </Space>
    </Card>
  );
};
