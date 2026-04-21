import React from 'react';

import { useUserStore } from '../../../../entities/user/model/userStore';
import { UserInfo } from '../../../../entities/user/ui/UserInfo/UserInfo';
import { PageShell } from '../../../../shared/ui/PageShell/PageShell';

export const ProfilePage: React.FC = () => {
  const { user, isLoading, error } = useUserStore();
  return (
    <PageShell title="Профиль" description="Данные учётной записи и контакты.">
      <UserInfo user={user} isLoading={isLoading} error={error} />
    </PageShell>
  );
};
