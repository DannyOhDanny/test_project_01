import React from 'react';
import './AppLayout.css';
import { Layout, Menu, Flex } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { LogoutButton } from '../../../features/auth/by-username/ui/LogoutButton/LogoutButton';
import { useUserStore } from '../../../entities/user/model/userStore';
import { UserOutlined } from '@ant-design/icons';

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
            {user.firstName}
            {user.lastName}
            <LogoutButton />
          </Flex>
        )}
      </Header>

      <Content style={{ padding: '24px 50px', border: 'none' }}>{children}</Content>

      <Footer style={{ textAlign: 'center' }}>
        Project 01 ©{new Date().getUTCMonth()}.{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
