import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useUserStore } from '../../../../../entities/user/model/userStore';

export const LogoutButton: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const setUser = useUserStore((state: any) => state.setUser);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  }, [navigate, setUser]);

  return <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />} />;
});

LogoutButton.displayName = 'LogoutButton';
