import type { AppThemeMode } from '../../../../../app/App';
import type { User } from '../../../model/types';
export type EditProfileFormValues = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'phone' | 'gender' | 'age'
>;

export interface UserInfoProps {
  themeMode: AppThemeMode;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
