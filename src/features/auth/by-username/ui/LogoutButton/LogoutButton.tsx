import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useAuthStore } from '../../../../../entities/user/model/authStore';

export const LogoutButton: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [navigate, logout]);

  return (
    <Button
      area-label="Выход из аккаунат"
      type="primary"
      onClick={handleLogout}
      icon={<LogoutOutlined />}
    />
  );
});

LogoutButton.displayName = 'LogoutButton';
