import type { EditProfileFormValues } from '../model/types';

export const EDIT_PROFILE_KEYS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'gender',
  'age',
] as const satisfies readonly (keyof EditProfileFormValues)[];
