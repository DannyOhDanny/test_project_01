import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Layout, Menu } from 'antd';

import { useUserStore } from '../../../entities/user/model/userStore';
import { LogoutButton } from '../../../features/auth/by-username/ui/LogoutButton/LogoutButton';

import './AppLayout.css';

const { Header, Content, Footer } = Layout;
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  const menuItems = [
    {
      key: '/table',
      label: 'Таблица',
      onClick: () => navigate('/table'),
    },
    {
      key: '/profile',
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: '/stats',
      label: 'Статистика',
      onClick: () => navigate('/stats'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', border: 0 }} className="app-layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          boxShadow: 'inset 0 -2px 0 0  #f3f3f3',
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />

        {user && (
          <Flex gap={12} align="center">
            <UserOutlined />
            {user.firstName} {user.lastName}
            <LogoutButton />
          </Flex>
        )}
      </Header>

      <Content style={{ padding: '24px 50px', border: 'none' }}>{children}</Content>

      <Footer style={{ textAlign: 'center', color: 'grey' }}>
        Table App v.01 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
