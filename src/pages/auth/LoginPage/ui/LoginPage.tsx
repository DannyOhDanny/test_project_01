import React from 'react';
import { useNavigate } from 'react-router';
import { Col, Layout, Row } from 'antd';

import { LoginForm } from '../../../../features/auth/by-username/ui/LoginForm/LoginForm';
import type { AppThemeMode } from '../../../../shared/config/themeMode';

import './LoginPage.css';

const { Content } = Layout;
type LoginPageProps = {
  themeMode: AppThemeMode;
};

export const LoginPage: React.FC<LoginPageProps> = ({ themeMode }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/table');
  };

  return (
    <Content className={`app-content-${themeMode}`}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh', border: 'none' }}>
        <Col>
          <LoginForm onSuccess={handleLoginSuccess} themeMode={themeMode} />
        </Col>
      </Row>
    </Content>
  );
};
