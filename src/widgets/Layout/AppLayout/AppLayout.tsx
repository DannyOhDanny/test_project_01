import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu, Segmented } from 'antd';

import logoSrc from '../../../../public/favicon.svg';
import { useUserStore } from '../../../entities/user/model/userStore';
import { LogoutButton } from '../../../features/auth/by-username/ui/LogoutButton/LogoutButton';
import type { AppThemeMode } from '../../../shared/config/themeMode';
import { menuStyles } from '../../../shared/styles/shell';

import { menuItems } from './config/menuConfig';
import type { AppLayoutProps } from './model/types';

import './AppLayout.css';

const { Header, Content, Footer } = Layout;

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, themeMode: userThemeModeState, setThemeMode } = useUserStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const menuItemsConfig = menuItems(navigate);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(max-width: 900px)');
    const onChange = () => setIsCompactHeader(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setThemeMode(userThemeModeState);
  }, [userThemeModeState, setThemeMode]);

  return (
    <Layout
      style={{ minHeight: '100vh', border: 0 }}
      className={userThemeModeState === 'dark' ? `app-layout-dark` : `app-layout-light`}
    >
      <Header
        style={
          userThemeModeState === 'dark'
            ? { ...menuStyles('dark'), backgroundColor: '#141414' }
            : { ...menuStyles('light'), backgroundColor: '#fff' }
        }
      >
        {!isCompactHeader && (
          <Image
            className={userThemeModeState === 'dark' ? `menu-logo-dark` : `menu-logo-light`}
            preview={false}
            width={100}
            height={60}
            alt="logo"
            src={logoSrc}
            styles={{
              root: menuStyles(userThemeModeState),
            }}
          />
        )}
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItemsConfig}
          style={{ flex: 1, minWidth: 0 }}
        />

        {user && (
          <Flex align="center" gap={10} justify="end">
            <Segmented
              size="small"
              shape="round"
              value={userThemeModeState}
              onChange={(value) => setThemeMode(value as AppThemeMode)}
              options={[
                { value: 'light', icon: <SunOutlined /> },
                { value: 'dark', icon: <MoonOutlined /> },
              ]}
            />
            <Flex
              align="center"
              className={isHovered ? 'app-layout-header-user-hovered' : 'app-layout-header-user'}
              onClick={() => navigate('/profile')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <UserOutlined />
              {user.firstName} {user.lastName}
              <LogoutButton />
            </Flex>
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
