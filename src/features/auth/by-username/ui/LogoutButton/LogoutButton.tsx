// features/auth/by-username/ui/LogoutButton/LogoutButton.tsx
import React, { useCallback } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
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

  return (
    <Button type="primary" danger onClick={handleLogout}>
      Выйти
    </Button>
  );
});

LogoutButton.displayName = 'LogoutButton';
