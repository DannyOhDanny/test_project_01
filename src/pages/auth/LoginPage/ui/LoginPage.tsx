import React from 'react';
import { useNavigate } from 'react-router';
import { Col, Layout, Row } from 'antd';

import { LoginForm } from '../../../../features/auth/by-username/ui/LoginForm/LoginForm';

import './LoginPage.css';

const { Content } = Layout;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/table');
  };

  return (
    <Content className="app-content">
      <Row justify="center" align="middle" style={{ minHeight: '100vh', border: 'none' }}>
        <Col>
          <LoginForm onSuccess={handleLoginSuccess} />
        </Col>
      </Row>
    </Content>
  );
};
