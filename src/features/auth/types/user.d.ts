import { USER_ROLES } from "../constants/api.constant";

export type TRole = (typeof USER_ROLES)[keyof (typeof USER_ROLES)]

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: TRole;
  createdAt: string;
  updatedAt: string;
}

const user: IUser = {
  id: '1',
  username: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  firstName: 'John',
  lastName: 'Doe',
  profilePhoto: null,
  emailVerified: true,
  phoneVerified: true,
  role: USER_ROLES.ADMIN,
}