import React from 'react';
import { useUserStore } from '../../../../entities/user/model/userStore';
import { UserInfo } from '../../../../entities/user/ui/UserInfo/UserInfo';

export const ProfilePage: React.FC = () => {
  const { user } = useUserStore();
  if (!user) return null;
  return <UserInfo user={user} />;
};
