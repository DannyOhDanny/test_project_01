import React from 'react';

import { useUserStore } from '../../../../entities/user/model/userStore';
import { UserInfo } from '../../../../entities/user/ui/UserInfo/UserInfo';

export const ProfilePage: React.FC = () => {
  const { user, isLoading, error } = useUserStore();
  return <UserInfo user={user} isLoading={isLoading} error={error} />;
};
