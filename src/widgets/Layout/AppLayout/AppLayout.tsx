import React from 'react';
import './AppLayout.css';
import { Layout, Menu, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { LogoutButton } from '../../../features/auth/by-username/ui/LogoutButton/LogoutButton';
import { useUserStore } from '../../../entities/user/model/userStore';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  const menuItems = [
    {
      key: '/profile',
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: '/table',
      label: 'Таблица',
      onClick: () => navigate('/table'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', border: 0 }} className="app-layout">
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Главная
        </Title>

        <Space>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0 }}
          />

          {user && (
            <Space>
              <span style={{ color: 'white' }}>
                {user.firstName} {user.lastName}
              </span>
              <LogoutButton />
            </Space>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 50px', border: 'none' }}>
        <div style={{ background: 'white', padding: 24, minHeight: 380 }}>{children}</div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Тестовое ©{new Date().getUTCMonth()}.{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
