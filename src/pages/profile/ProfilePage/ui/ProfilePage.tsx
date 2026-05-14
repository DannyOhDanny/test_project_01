import React from 'react';

import { useUserStore } from '../../../../entities/user/model/userStore';
import { UserInfo } from '../../../../entities/user/ui/UserInfo/UserInfo';
import type { AppThemeMode } from '../../../../shared/config/themeMode';
import { PageShell } from '../../../../shared/ui/PageShell/PageShell';

interface ProfilePageProps {
  themeMode: AppThemeMode;
}
export const ProfilePage: React.FC<ProfilePageProps> = ({ themeMode }) => {
  const { user, isLoading, error } = useUserStore();
  return (
    <PageShell
      themeMode={themeMode}
      title="Профиль"
      description="Данные учётной записи и контакты."
    >
      <UserInfo themeMode={themeMode} user={user} isLoading={isLoading} error={error} />
    </PageShell>
  );
};
