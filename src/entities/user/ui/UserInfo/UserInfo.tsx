import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import { Avatar, Card, Descriptions, Flex, Typography } from 'antd';

import { User } from '../../model/types';

const { Title, Text } = Typography;
interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  if (!user) return null;

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Пользователь',
      children: `${user.firstName} ${user.lastName}`,
    },
    {
      key: '2',
      label: 'Тел.',
      children: user.phone,
    },
    {
      key: '3',
      label: 'Эл.почта',
      children: user.email,
    },
    {
      key: '4',
      label: 'Пол',
      children: user.gender === 'male' ? 'Муж' : 'Жен.',
    },
    {
      key: '5',
      label: 'Возраст',
      children: `${user.age} лет`,
    },
  ];
  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <Flex vertical align="center" gap={16} style={{ marginBottom: 24 }}>
        <Avatar
          size={96}
          icon={<UserOutlined />}
          style={{ backgroundColor: '#242EDB', flexShrink: 0 }}
        />
        <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
          {user.firstName} {user.lastName}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          @{user.username}
        </Text>
      </Flex>
      <Descriptions title="Профиль" items={items} />
    </Card>
  );
};

export { UserInfo };
