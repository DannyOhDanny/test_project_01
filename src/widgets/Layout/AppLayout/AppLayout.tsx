import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu } from 'antd';

import { useUserStore } from '../../../entities/user/model/userStore';
import { LogoutButton } from '../../../features/auth/by-username/ui/LogoutButton/LogoutButton';
import { menuStyles } from '../../../shared/styles/shell';

import './AppLayout.css';

const { Header, Content, Footer } = Layout;
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const [isHovered, setIsHovered] = useState(false);
  const menuItems = [
    {
      key: '/table',
      label: 'Таблица',
      onClick: () => navigate('/table'),
    },

    {
      key: '/stats',
      label: 'Статистика',
      onClick: () => navigate('/stats'),
    },
    { key: '/calc', label: 'Калькулятор', onClick: () => navigate('/calc') },
  ];

  return (
    <Layout style={{ minHeight: '100vh', border: 0 }} className="app-layout">
      <Header style={menuStyles}>
        <Image
          style={{ overflow: 'hidden' }}
          preview={false}
          width={100}
          height={60}
          alt="logo"
          src="../../../../public/favicon.svg"
          styles={{
            root: menuStyles,
          }}
        />
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />

        {user && (
          <Flex
            gap={12}
            align="center"
            className={isHovered ? 'app-layout-header-user-hovered' : ''}
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer', marginRight: `clamp(0px, 3vw, 12px)` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <UserOutlined />
            {user.firstName} {user.lastName}
            <LogoutButton />
          </Flex>
        )}
      </Header>

      <Content
        style={{
          padding: 'clamp(16px, 2.5vw, 28px) clamp(14px, 4vw, 40px)',
          border: 'none',
        }}
      >
        {children}
      </Content>

      <Footer style={{ textAlign: 'center', color: 'grey' }}>
        Table App v.01 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
