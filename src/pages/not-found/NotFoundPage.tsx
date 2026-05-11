import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Result, Space, Typography } from 'antd';

import { useUserStore } from '../../entities/user/model/userStore';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const primaryAction = () => {
    navigate(isAuthenticated ? '/table' : '/login', { replace: true });
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 48px)' }}>
      <Result
        status="404"
        title="404"
        subTitle={
          <Space orientation="vertical" size={4}>
            <Typography.Text>Страница не найдена.</Typography.Text>
            <Typography.Text type="secondary">{location.pathname}</Typography.Text>
          </Space>
        }
        extra={
          <Space wrap>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <Button type="primary" onClick={primaryAction}>
              {isAuthenticated ? 'На главную' : 'Войти'}
            </Button>
          </Space>
        }
      />
    </div>
  );
};
