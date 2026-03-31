import React from 'react';
import { Typography, Card, Descriptions, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserStore } from '../../../../entities/user/model/userStore';

const { Title } = Typography;

export const ProfilePage: React.FC = () => {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}> Профиль пользователя</Title>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space wrap size={16}>
            <Avatar size={64} icon={<UserOutlined />} />
            <Title level={3}>
              {user.firstName} {user.lastName}
            </Title>
          </Space>

          <Descriptions bordered column={2}>
            <Descriptions.Item label="Логин">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            {user.age && <Descriptions.Item label="Возраст">{user.age}</Descriptions.Item>}
            {user.phone && <Descriptions.Item label="Телефон">{user.phone}</Descriptions.Item>}
            {user.birthDate && (
              <Descriptions.Item label="Дата рождения">{user.birthDate}</Descriptions.Item>
            )}
          </Descriptions>
        </Space>
      </Card>
    </Space>
  );
};
