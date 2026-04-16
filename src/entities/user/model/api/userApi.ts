import { axiosUsersInstance } from '../../../../shared/api/axiosConfig';
import type { User } from '../types';

export type UpdateUserPayload = Partial<
  Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'gender' | 'age'>
>;

export const userApi = {
  patchUser: (id: string | number, data: UpdateUserPayload) =>
    axiosUsersInstance.patch<User>(`/${id}`, data),
};
